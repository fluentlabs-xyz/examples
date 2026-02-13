#![cfg_attr(not(feature = "std"), no_std, no_main)]

extern crate alloc;
extern crate fluentbase_sdk;

use fluentbase_sdk::{
    basic_entrypoint,
    derive::{router, Contract},
    Bytes, SharedAPI, U256,
};

pub(crate) mod direction;
pub(crate) mod game;
pub(crate) mod grid;
pub(crate) mod prng;

use game::TilesGame;

#[derive(Contract, Default)]
pub struct Validator<SDK> {
    sdk: SDK,
}

pub trait ValidatorAPI {
    fn get_score(&self, seed: u64, moves: Bytes, moves_len: u64) -> U256;
}

#[router(mode = "solidity")]
impl<SDK: SharedAPI> ValidatorAPI for Validator<SDK> {
    #[function_id("getScore(uint64,bytes,uint64)")]
    fn get_score(&self, seed: u64, moves: Bytes, moves_len: u64) -> U256 {
        let moves = direction::moves_from_bytes(&moves, moves_len);
        U256::from(TilesGame::play(seed, moves))
    }
}

impl<SDK: SharedAPI> Validator<SDK> {
    pub fn deploy(&self) {}
}

basic_entrypoint!(Validator);

#[cfg(test)]
mod tests {
    use super::*;
    use fluentbase_sdk::{address, codec::Encoder, ContractContextV1, U256};
    use fluentbase_testing::HostTestingContext;

    fn call_get_score(seed: u64, moves_hex: &str, moves_len: u64) -> U256 {
        let caller = address!("1111111111111111111111111111111111111111");
        let contract_addr = address!("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

        let moves_bytes = if moves_hex.is_empty() {
            Bytes::new()
        } else {
            Bytes::from(hex::decode(moves_hex).unwrap())
        };

        let call = GetScoreCall::new((seed, moves_bytes, moves_len));

        let sdk = HostTestingContext::default()
            .with_input(call.encode())
            .with_contract_context(ContractContextV1 {
                address: contract_addr,
                caller,
                ..Default::default()
            });

        let mut contract = Validator::new(sdk.clone());
        contract.main();

        let result = GetScoreReturn::decode(&&contract.sdk.take_output()[..]).unwrap();
        result.0 .0
    }

    #[test]
    fn test_zero_moves() {
        // No moves — score should be 0
        let score = call_get_score(123456789, "", 0);
        assert_eq!(score, U256::from(0));
    }

    #[test]
    fn test_single_move() {
        // One move left (0b00 = Left, padded: 0x00)
        let score = call_get_score(123456789, "00", 1);
        assert_eq!(score, U256::from(0));
    }

    #[test]
    fn test_few_moves() {
        // 7 moves: Left, Up, Left, Up, Up, Left, Left
        // From game::tests::test_simple_get_score — expected score 20
        let score = call_get_score(123456789, "2281", 7);
        assert_eq!(score, U256::from(20));
    }

    #[test]
    fn test_different_seeds() {
        // Same moves, different seeds — should not panic
        for seed in [0u64, 1, 42, u64::MAX, u64::MAX - 1] {
            let score = call_get_score(seed, "00", 1);
            // Just checking it doesn't panic
            assert!(score <= U256::from(u32::MAX));
        }
    }

    #[test]
    fn test_edge_case_seeds() {
        // Seeds that might produce random() == 1.0
        // Testing the clamp fix
        for seed in [0u64, u64::MAX, u64::MAX / 2] {
            let score = call_get_score(seed, "2281", 7);
            assert!(score <= U256::from(u32::MAX));
        }
    }
}
