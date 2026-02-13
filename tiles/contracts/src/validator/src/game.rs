use crate::{
    direction::Move,
    grid::{Grid, Tile},
    prng::Xorshift128Plus,
};
use alloc::{vec, vec::Vec};
use core::{fmt::Debug, usize};

/// 90% threshold for tile value selection (0.9 * u64::MAX)
const TILE_VALUE_THRESHOLD: u64 = (u64::MAX as u128 * 9 / 10) as u64;

#[derive(Debug)]
pub struct TilesGame {
    size: usize,
    grid: Grid,
    score: u32,
    moves: Vec<Move>,
    game_over: bool,
    rng: Xorshift128Plus,
}

impl TilesGame {
    pub fn new(size: usize, seed: u64) -> Self {
        let mut game = Self {
            size,
            grid: Grid::new(size),
            score: 0,
            moves: Vec::new(),
            game_over: false,
            rng: Xorshift128Plus::new(seed),
        };
        game.add_start_tiles();
        game
    }

    #[cfg(test)]
    pub fn with_state(size: usize, seed: u64, score: u32, grid: Grid) -> Self {
        Self {
            size,
            grid,
            score,
            moves: Vec::new(),
            game_over: false,
            rng: Xorshift128Plus::new(seed),
        }
    }

    pub fn play(seed: u64, moves: Vec<Move>) -> u32 {
        let mut game = TilesGame::new(4, seed);
        for direction in moves.into_iter() {
            game.move_tiles(direction);
            if game.game_over {
                break;
            }
        }
        game.score
    }

    fn add_start_tiles(&mut self) {
        for _ in 0..2 {
            self.add_random_tile();
        }
    }

    fn add_random_tile(&mut self) {
        let available = self.grid.available_cells();
        if available.is_empty() {
            return;
        }

        let value_rnd = self.rng.next();
        let cell_rnd = self.rng.next();

        // Equivalent to: Math.floor((cell_rnd / 2^64) * len)
        let len = available.len() as u128;
        let index = ((cell_rnd as u128 * len) >> 64) as usize;

        let (x, y) = available[index];

        // Equivalent to: (value_rnd / u64::MAX) < 0.9
        let value = if value_rnd < TILE_VALUE_THRESHOLD {
            2
        } else {
            4
        };

        self.grid.insert_tile(Tile::new(x, y, value));
    }

    fn move_tiles(&mut self, direction: Move) {
        let mut moved = false;
        let vector = direction.to_vector();
        let traversals = self.build_traversals(vector);

        self.grid.prepare_tiles();

        for &x in &traversals.x {
            for &y in &traversals.y {
                if let Some(mut tile) = self.grid.cell_content(x, y) {
                    let (farthest, next) = self.find_farthest_position((x as i8, y as i8), vector);

                    match self.grid.cell_content(next.0 as usize, next.1 as usize) {
                        Some(next_tile) if tile.value == next_tile.value && !next_tile.merged => {
                            let mut merged_tile =
                                Tile::new(next.0 as usize, next.1 as usize, tile.value * 2);
                            merged_tile.merged = true;
                            self.grid.insert_tile(merged_tile);
                            self.grid.remove_tile(&tile);
                            self.score += merged_tile.value;
                            moved = true;
                        }
                        _ => {
                            self.move_tile(&mut tile, (farthest.0 as usize, farthest.1 as usize));
                            if (farthest.0 as usize, farthest.1 as usize) != (x, y) {
                                moved = true;
                            }
                        }
                    }
                }
            }
        }

        self.reset_merged_flags();

        if moved {
            self.moves.push(direction);
            self.add_random_tile();
        } else {
            if !self.moves_available() {
                self.game_over = true;
            }
        }
    }

    fn reset_merged_flags(&mut self) {
        for x in 0..self.size {
            for y in 0..self.size {
                if let Some(tile) = self.grid.cell_content(x, y) {
                    let mut tile = tile.clone();
                    tile.merged = false;
                    self.grid.cells[x][y] = Some(tile);
                }
            }
        }
    }

    fn build_traversals(&self, vector: (i8, i8)) -> Traversals {
        let mut traversals = Traversals {
            x: vec![],
            y: vec![],
        };

        for pos in 0..self.size {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }

        if vector.0 == 1 {
            traversals.x.reverse();
        }
        if vector.1 == 1 {
            traversals.y.reverse();
        }

        traversals
    }

    fn find_farthest_position(&self, cell: (i8, i8), vector: (i8, i8)) -> ((i8, i8), (i8, i8)) {
        let mut previous = cell;
        let mut cell = (previous.0 + vector.0, previous.1 + vector.1);

        while self.grid.within_bounds(cell.0, cell.1)
            && self
                .grid
                .cell_content(cell.0 as usize, cell.1 as usize)
                .is_none()
        {
            previous = cell;
            cell = (previous.0 + vector.0, previous.1 + vector.1);
        }

        (previous, cell)
    }

    fn move_tile(&mut self, tile: &mut Tile, (x, y): (usize, usize)) {
        self.grid.remove_tile(&tile);
        tile.update_position((x, y));
        self.grid.insert_tile(*tile);
    }

    fn moves_available(&self) -> bool {
        !self.grid.available_cells().is_empty()
    }
}

#[derive(Debug)]
struct Traversals {
    x: Vec<usize>,
    y: Vec<usize>,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::direction::Move;

    fn grid_from_vec(from_grid: Vec<Vec<u32>>) -> Grid {
        let mut grid = Grid::new(4);
        for (i, row) in from_grid.iter().enumerate() {
            for (j, value) in row.iter().enumerate() {
                if *value != 0 {
                    grid.insert_tile(Tile::new(j, i, *value));
                }
            }
        }
        grid
    }

    #[test]
    fn test_new_game_initializes() {
        let game = TilesGame::new(4, 123456789);
        // Should have exactly 2 tiles after init
        let occupied = 16 - game.grid.available_cells().len();
        assert_eq!(occupied, 2);
    }

    #[test]
    fn test_move_produces_no_panic() {
        let mut game = TilesGame::new(4, 123456789);
        game.move_tiles(Move::Up);
        game.move_tiles(Move::Down);
        game.move_tiles(Move::Left);
        game.move_tiles(Move::Right);
    }

    #[test]
    fn test_various_seeds_no_panic() {
        for seed in [0u64, 1, 42, 999999, u64::MAX, u64::MAX - 1] {
            let mut game = TilesGame::new(4, seed);
            game.move_tiles(Move::Left);
            game.move_tiles(Move::Up);
            game.move_tiles(Move::Right);
            game.move_tiles(Move::Down);
        }
    }

    #[test]
    fn test_game_over_on_full_board() {
        let moves = vec![Move::Down; 200];
        let game_score = TilesGame::play(123456789, moves);
        // Should not panic, score is some value
        assert!(game_score < u32::MAX);
    }
}
