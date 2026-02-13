use alloc::vec::Vec;

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Move {
    Left,
    Right,
    Up,
    Down,
}

impl Move {
    pub fn from_bits(bits: u8) -> Option<Self> {
        match bits {
            0b00 => Some(Move::Left),
            0b01 => Some(Move::Right),
            0b10 => Some(Move::Up),
            0b11 => Some(Move::Down),
            _ => None,
        }
    }

    pub fn to_vector(self) -> (i8, i8) {
        match self {
            Move::Up => (0, -1),
            Move::Right => (1, 0),
            Move::Down => (0, 1),
            Move::Left => (-1, 0),
        }
    }
}

pub fn moves_from_bytes(bytes: &[u8], moves_len: u64) -> Vec<Move> {
    let mut moves = Vec::new();
    let mut moves_handled = 0;

    for &byte in bytes {
        for bit_offset in (0..8).step_by(2).rev() {
            if moves_handled >= moves_len {
                return moves;
            }

            let bits = (byte >> bit_offset) & 0b11;
            if let Some(direction) = Move::from_bits(bits) {
                moves.push(direction);
                moves_handled += 1;
            }
        }
    }

    moves
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_moves_parsing() {
        let moves_hex = "0x2281111111111a22c4bbbae8";
        let moves_expected = vec![
            Move::Left,
            Move::Up,
            Move::Left,
            Move::Up,
            Move::Up,
            Move::Left,
            Move::Left,
            Move::Right,
            Move::Left,
            Move::Right,
            Move::Left,
            Move::Right,
            Move::Left,
            Move::Right,
            Move::Left,
            Move::Right,
            Move::Left,
            Move::Right,
            Move::Left,
            Move::Right,
            Move::Left,
            Move::Right,
            Move::Left,
            Move::Right,
            Move::Left,
            Move::Right,
            Move::Up,
            Move::Up,
            Move::Left,
            Move::Up,
            Move::Left,
            Move::Up,
            Move::Down,
            Move::Left,
            Move::Right,
            Move::Left,
            Move::Up,
            Move::Down,
            Move::Up,
            Move::Down,
            Move::Up,
            Move::Down,
            Move::Up,
            Move::Up,
            Move::Down,
            Move::Up,
            Move::Up,
        ];

        let moves_b = hex::decode(&moves_hex[2..]).expect("Invalid hex string");
        let moves = moves_from_bytes(&moves_b, moves_expected.len() as u64);
        assert_eq!(moves, moves_expected);
    }
}
