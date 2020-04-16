# Architecture

## Previous Art

A number of amazing technologies were investigated before embarking on this journey. A few of the best being DAT, Hypermerge, Textile, and 3Box.

...in the end, I just wanted something simpler.

Also, one major difference is that this needs to not fail if two clients attempt to write to the same place at the same time, although that should never happen. Another major difference being that the underlying CRDT (_automerge_) is already append-only, so adding a data structure like _hypercore_ underneath doesn't do us a lot of good. Finally, we are only ever going to be reading the end of the files unless we care getting history, so being able to efficiently download chunks doesn't do a whole lot of good either. Best to just keep it simple.

## Bootstrapping

At any point, any client should be able to link up to their data with just their BIP39 phrase. In addition, all files should be impossible to conclusively identify from the server.

- Upload the initial files in a random order. Include one "dummy" file which will also receive updates until it is "full"
- The index file name and the dummy file names are computed deterministically, so that new clients can request both files in a random order when joining.
  - index: hash(app_name + "index" + last_6_words_of_seed_phrase)
  - dummy: hash(first_6_words_of_seed_phrase + "dummy" + app_name)
- It is recommended that other initial storage containers are added into the init method in order to increase the confusion

## Security

Each stored file is the same size so that contents should be hard to determine. Nonces are also added to every change, and there are multiple changes in a file, which should further complicate the matter.

> TODO should we also randomize uploads in batches instead of right away to avoid timing attacks?

## Layout

All data is added in chunks in the following format:

- header_byte:
  - 0: fake chunk
  - 1: real chunk, not last chunk in write
  - 2: real chunk, last chunk in write
- if header_byte = 1 AND is the last chunk in the file:
  - int64 - address of the next file
  - data
- else:
  - data

> Chunk names are stored in a [sparse-bitfield](https://github.com/mafintosh/sparse-bitfield) file, which are also loaded into memory.

Each chunk is encrypted with the users private key before transfer.

If there are not enough real chunks to fill the file to the correct size, the rest of the chunks are "fake" but also encrypted and written

> TODO doesn't this cause an issue since someone watching could see that the fake
> chunks changed later but the real ones did not?

### index

```js
// first 8 bytes of the file indicate the length of the initial index file data structure without changes
// second 8 bytes indicate the path to the next file (crypto-random) which may or may not be created yet
{
  client_index: 'abc', // crypto-random path to the client file
  files: [{
    path: 'path/to/file',
    id: 'path_to_first_chunk'
  }]
}
```

### file_contents

```js
automerge_change[]
```

### client_index

```js
[
  {
    client_id: 'abc', // unique id of client
    marker: 1234, // optional - unix timestamp to mark last sync if a consolidation was requested. if one marker is present, that means that a consolidation was requested.
  },
];
```

## Consolidating Data

Maintaining changes forever can result in large datasets. Occasionally it is good to clean this data up. This is why we maintain a list of clients.

TODO user can select to preserve changes from which clients.
