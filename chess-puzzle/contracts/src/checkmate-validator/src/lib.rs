#![cfg_attr(not(feature = "std"), no_std, no_main)]

extern crate alloc;
extern crate fluentbase_sdk;

use alloc::string::String;
use fluentbase_sdk::{
    basic_entrypoint,
    derive::{router, Contract},
    SharedAPI,
};
use shakmaty::{fen::Fen, san::San, CastlingMode, Chess, FromSetup, Position, Setup};

#[derive(Contract, Default)]
pub struct App<SDK> {
    sdk: SDK,
}

#[router(mode = "solidity")]
impl<SDK: SharedAPI> App<SDK> {
    #[function_id("isCheckmate(string,string)")]
    pub fn is_checkmate(&self, board: String, mv: String) -> bool {
        // parse the FEN string to a Fen object
        let Ok(fen) = Fen::from_ascii(board.as_bytes()) else {
            return false;
        };
        // convert the Fen object to a Setup object
        let setup = Setup::from(fen);
        // convert the Setup object to a Chess object
        let Ok(pos) = Chess::from_setup(setup, CastlingMode::Standard) else {
            return false;
        };
        // parse the move string to a San object
        let Ok(san) = mv.parse::<San>() else {
            return false;
        };
        // convert the San object to a Move object
        let Ok(mv) = san.to_move(&pos) else {
            return false;
        };
        // try to play the move on the chess board and get new position
        let Ok(new_pos) = pos.play(mv) else {
            return false;
        };
        // check if the new position is a checkmate
        new_pos.is_checkmate()
    }

    #[function_id("isBoardValid(string)")]
    pub fn is_board_valid(&self, board: String) -> bool {
        // parse the FEN string to a Fen object
        let Ok(fen) = Fen::from_ascii(board.as_bytes()) else {
            return false;
        };
        // convert the Fen object to a Setup object
        let setup = Setup::from(fen);
        // check if the board is valid
        let Ok(_) = Chess::from_setup(setup, CastlingMode::Standard) else {
            return false;
        };
        true
    }
}

impl<SDK: SharedAPI> App<SDK> {
    pub fn deploy(&self) {}
}

basic_entrypoint!(App);

#[cfg(test)]
mod tests {
    use super::*;
    use alloy_sol_types::{sol, SolCall, SolType};
    use fluentbase_sdk::codec::Encoder;
    use fluentbase_testing::HostTestingContext;
    use crate::alloc::string::ToString;

    sol!(
        function isCheckmate(string memory board, string memory mv) public view returns (bool);
        function isBoardValid(string memory board) public view returns (bool);
    );

    #[test]
    fn test_input_output() {
        let board = "rnbq1k1r/1p1p3p/5npb/2pQ1p2/p1B1P2P/8/PPP2PP1/RNB1K1NR w KQ - 2 11";
        let mv = "Qf7";
        let fluent_input = IsCheckmateCall::new((board.to_string(), mv.to_string())).encode();
        let sol_input = isCheckmateCall {
            board: board.to_string(),
            mv: mv.to_string(),
        }
        .abi_encode();
        assert_eq!(fluent_input.to_vec(), sol_input);
        let fluent_output = IsCheckmateReturn((true,)).encode();
        let sol_output = <(alloy_sol_types::sol_data::Bool,) as SolType>::abi_encode(&(true,));
        assert_eq!(fluent_output.to_vec(), sol_output);
    }

    #[test]
    fn test_is_checkmate_no_checkmate() {
        let input = IsCheckmateCall::new((
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR".to_string(),
            "e2e4".to_string(),
        ))
        .encode();

        let sdk = HostTestingContext::default().with_input(input);
        let mut app = App::new(sdk.clone());
        app.deploy();
        app.main();

        let output = &sdk.take_output();
        let result = IsCheckmateReturn::decode(&output.as_slice()).unwrap();
        assert_eq!(result.0 .0, false);
    }

    #[test]
    fn test_is_checkmate_is_checkmate() {
        let input = IsCheckmateCall::new((
            "rnbq1k1r/1p1p3p/5npb/2pQ1p2/p1B1P2P/8/PPP2PP1/RNB1K1NR w KQ - 2 11".to_string(),
            "Qf7".to_string(),
        ))
        .encode();

        let sdk = HostTestingContext::default().with_input(input);
        let mut app = App::new(sdk.clone());
        app.deploy();
        app.main();

        let output = &sdk.take_output();
        let result = IsCheckmateReturn::decode(&output.as_slice()).unwrap();
        assert_eq!(result.0 .0, true);
    }

    #[test]
    fn test_is_board_valid_invalid() {
        let input = IsBoardValidCall::new((
            "rrrq1k1r/1p1p3p/5npb/2pQ1p2/p1B1P2P/8/PPP2PP1/RNB1K1NR w KQ - 2 11".to_string(),
        ))
        .encode();

        let sdk = HostTestingContext::default().with_input(input);
        let mut app = App::new(sdk.clone());
        app.deploy();
        app.main();

        let output = &sdk.take_output();
        let result = IsBoardValidReturn::decode(&output.as_slice()).unwrap();
        assert_eq!(result.0 .0, false);
    }

    #[test]
    fn test_is_board_valid_valid() {
        let input = IsBoardValidCall::new((
            "rnbq1k1r/1p1p3p/5npb/2pQ1p2/p1B1P2P/8/PPP2PP1/RNB1K1NR w KQ - 2 11".to_string(),
        ))
        .encode();

        let sdk = HostTestingContext::default().with_input(input);
        let mut app = App::new(sdk.clone());
        app.deploy();
        app.main();

        let output = &sdk.take_output();
        let result = IsBoardValidReturn::decode(&output.as_slice()).unwrap();
        assert_eq!(result.0 .0, true);
    }
}