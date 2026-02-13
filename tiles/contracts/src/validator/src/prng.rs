use core::num::Wrapping as w;

#[derive(Debug)]
pub struct Xorshift128Plus {
    s0: w<u64>,
    s1: w<u64>,
}

impl Xorshift128Plus {
    pub fn new(seed: u64) -> Self {
        let seed1 = w(seed.wrapping_shl(1));
        let seed2 = w(seed.wrapping_shr(1));
        Xorshift128Plus {
            s0: seed1,
            s1: seed2,
        }
    }

    pub fn next(&mut self) -> u64 {
        let mut s1 = self.s0;
        let s0 = self.s1;
        self.s0 = s0;
        s1 ^= s1 << 23;
        s1 ^= s1 >> 17;
        s1 ^= s0 ^ (s0 >> 26);
        self.s1 = s1;
        (self.s1 + s0).0
    }
}
