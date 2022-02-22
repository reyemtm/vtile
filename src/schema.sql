CREATE TABLE IF NOT EXISTS tiles (
  zoom_level integer,
  tile_column integer,
  tile_row integer,
  tile_data blob,
  UNIQUE (
    zoom_level,
    tile_column,
    tile_row
  )
);

CREATE TABLE IF NOT EXISTS metadata (
  name text,
  value text
);