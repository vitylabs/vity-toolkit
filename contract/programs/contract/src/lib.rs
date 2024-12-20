use anchor_lang::prelude::*;

declare_id!("AEqfthAnEGQ27vp6Dy9nDzZPJL1wcicbGeiLcWnptn3N");

#[program]
pub mod contract {
    use super::*;

    pub fn save_app_auth(
        ctx: Context<SaveAppAuth>,
        app_name: String,
        auth_uri: String,
    ) -> Result<()> {
        // setting userdata in app's account
        let app_auth_data = &mut ctx.accounts.app_auth;
        app_auth_data.bump = ctx.bumps.app_auth;

        app_auth_data.app_id = *ctx.accounts.signer.key;
        app_auth_data.app_name = app_name.to_owned();
        app_auth_data.auth_uri = auth_uri.to_owned();

        // Printing App Info into program's on-chain transaction log.
        msg!("Saved App Auth Data");
        Ok(())
    }

    pub fn save_user_auth(
        ctx: Context<SaveUserAuth>,
        app_id: Pubkey,
        app_name: String,
        auth_uri: String,
    ) -> Result<()> {
        // setting userdata in user's account
        let user_auth_data = &mut ctx.accounts.user_auth;
        user_auth_data.bump = ctx.bumps.user_auth;

        user_auth_data.authority = *ctx.accounts.signer.key;
        user_auth_data.app_id = app_id.to_owned();
        user_auth_data.app_name = app_name.to_owned();
        user_auth_data.auth_uri = auth_uri.to_owned();

        // Printing User Info into program's on-chain transaction log.
        msg!("Saved User Auth Data");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SaveAppAuth<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init_if_needed,
        payer = signer,
        space = SaveAppAuth::LEN,
        seeds = ["app-auth".as_bytes(), signer.key().as_ref()], 
        bump,
    )]
    pub app_auth: Account<'info, AppAuth>,
    pub system_program: Program<'info, System>,
}

impl SaveAppAuth<'_> {
    const LEN: usize = 8 + // discriminator
        32 + // app_id
        32 + // app_name
        32 + // auth_uri
        1; // bump
}

#[derive(Accounts)]
pub struct SaveUserAuth<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init_if_needed,
        payer = signer,
        space = SaveUserAuth::LEN,
        seeds = ["user-auth".as_bytes(), signer.key().as_ref()], 
        bump,
    )]
    pub user_auth: Account<'info, UserAuth>,
    pub system_program: Program<'info, System>,
}

impl SaveUserAuth<'_> {
    const LEN: usize = 8 + // discriminator
        32 + // app_id
        32 + // authority
        32 + // app_name
        32 + // auth_uri
        1; // bump
}

#[account]
pub struct AppAuth {
    pub app_id: Pubkey, // app pubkey
    pub app_name: String, // app name like "twitter"
    pub auth_uri: String, // ipfs uri
    pub bump: u8,
}

#[account]
pub struct UserAuth {
    pub app_id: Pubkey, // app pubkey
    pub authority: Pubkey, // user pubkey
    pub app_name: String, // app name like "twitter"
    pub auth_uri: String, // ipfs uri
    pub bump: u8,
}
