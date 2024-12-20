/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/contract.json`.
 */
export type Contract = {
    "address": "AEqfthAnEGQ27vp6Dy9nDzZPJL1wcicbGeiLcWnptn3N",
    "metadata": {
      "name": "contract",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "saveAppAuth",
        "discriminator": [
          57,
          247,
          148,
          61,
          255,
          157,
          157,
          7
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "appAuth",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    97,
                    112,
                    112,
                    45,
                    97,
                    117,
                    116,
                    104
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "appName",
            "type": "string"
          },
          {
            "name": "authUri",
            "type": "string"
          }
        ]
      },
      {
        "name": "saveUserAuth",
        "discriminator": [
          185,
          144,
          222,
          86,
          43,
          218,
          66,
          120
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "userAuth",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    97,
                    117,
                    116,
                    104
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "appId",
            "type": "pubkey"
          },
          {
            "name": "appName",
            "type": "string"
          },
          {
            "name": "authUri",
            "type": "string"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "appAuth",
        "discriminator": [
          103,
          12,
          51,
          148,
          214,
          155,
          157,
          223
        ]
      },
      {
        "name": "userAuth",
        "discriminator": [
          207,
          57,
          58,
          39,
          26,
          218,
          82,
          91
        ]
      }
    ],
    "types": [
      {
        "name": "appAuth",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "appId",
              "type": "pubkey"
            },
            {
              "name": "appName",
              "type": "string"
            },
            {
              "name": "authUri",
              "type": "string"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "userAuth",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "appId",
              "type": "pubkey"
            },
            {
              "name": "authority",
              "type": "pubkey"
            },
            {
              "name": "appName",
              "type": "string"
            },
            {
              "name": "authUri",
              "type": "string"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      }
    ]
  };
  