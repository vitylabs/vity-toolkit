use anchor_lang::prelude::*;

declare_id!("AEqfthAnEGQ27vp6Dy9nDzZPJL1wcicbGeiLcWnptn3N");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
