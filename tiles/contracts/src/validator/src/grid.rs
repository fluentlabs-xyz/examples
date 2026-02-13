use alloc::{vec, vec::Vec};

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Tile {
    pub x: usize,
    pub y: usize,
    pub value: u32,
    pub merged: bool,
}

impl Tile {
    pub fn new(x: usize, y: usize, value: u32) -> Self {
        Self {
            x,
            y,
            value,
            merged: false,
        }
    }

    pub fn update_position(&mut self, new_position: (usize, usize)) {
        self.x = new_position.0;
        self.y = new_position.1;
    }
}

#[derive(Debug, PartialEq)]
pub struct Grid {
    pub size: usize,
    pub cells: Vec<Vec<Option<Tile>>>,
}

impl Grid {
    pub fn new(size: usize) -> Self {
        let cells = vec![vec![None; size]; size];
        Self { size, cells }
    }

    pub fn available_cells(&self) -> Vec<(usize, usize)> {
        let mut cells = Vec::new();
        for x in 0..self.size {
            for y in 0..self.size {
                if self.cells[x][y].is_none() {
                    cells.push((x, y));
                }
            }
        }
        cells
    }

    #[cfg(test)]
    pub fn cell_available(&self, x: usize, y: usize) -> bool {
        self.cells[x][y].is_none()
    }

    pub fn insert_tile(&mut self, tile: Tile) {
        self.cells[tile.x][tile.y] = Some(tile);
    }

    pub fn remove_tile(&mut self, tile: &Tile) {
        self.cells[tile.x][tile.y] = None;
    }

    pub fn cell_content(&self, x: usize, y: usize) -> Option<Tile> {
        if self.within_bounds(x as i8, y as i8) {
            self.cells[x][y]
        } else {
            None
        }
    }

    pub fn within_bounds(&self, x: i8, y: i8) -> bool {
        if x < 0 || y < 0 {
            return false;
        }
        x < self.size as i8 && y < self.size as i8
    }

    pub fn prepare_tiles(&mut self) {
        for row in &mut self.cells {
            for cell in row.iter_mut() {
                if let Some(tile) = cell {
                    tile.update_position((tile.x, tile.y));
                }
            }
        }
    }
}

#[cfg(feature = "std")]
impl std::fmt::Display for Grid {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        for row in 0..self.size {
            for col in 0..self.size {
                if let Some(tile) = &self.cells[col][row] {
                    write!(f, "{:4}", tile.value)?;
                } else {
                    write!(f, "{:4}", 0)?;
                }
            }
            writeln!(f)?;
        }
        writeln!(f)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_grid_creation() {
        let size = 4;
        let grid = Grid::new(size);
        assert_eq!(grid.size, size);
        assert_eq!(grid.cells.len(), size);
        for row in grid.cells.iter() {
            assert_eq!(row.len(), size);
            for cell in row.iter() {
                assert!(cell.is_none());
            }
        }
    }

    #[test]
    fn test_insert_tile() {
        let mut grid = Grid::new(4);
        let tile = Tile::new(1, 2, 4);
        grid.insert_tile(tile);
        assert_eq!(grid.cells[1][2], Some(tile));
    }

    #[test]
    fn test_remove_tile() {
        let mut grid = Grid::new(4);
        let tile = Tile::new(1, 2, 4);
        grid.insert_tile(tile);
        assert_eq!(grid.cells[1][2], Some(tile));
        grid.remove_tile(&tile);
        assert!(grid.cells[1][2].is_none());
    }

    #[test]
    fn test_available_cells() {
        let mut grid = Grid::new(4);
        let tile1 = Tile::new(0, 0, 2);
        let tile2 = Tile::new(1, 1, 4);
        grid.insert_tile(tile1);
        grid.insert_tile(tile2);
        let available_cells = grid.available_cells();
        assert_eq!(available_cells.len(), 14);
        assert!(!available_cells.contains(&(0, 0)));
        assert!(!available_cells.contains(&(1, 1)));
    }

    #[test]
    fn test_print_grid() {
        let mut grid = Grid::new(4);
        let tile1 = Tile::new(0, 0, 2);
        let tile2 = Tile::new(1, 1, 4);
        grid.insert_tile(tile1);
        grid.insert_tile(tile2);
    }
}
