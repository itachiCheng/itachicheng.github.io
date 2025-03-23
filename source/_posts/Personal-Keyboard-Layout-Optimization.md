---
title: Personal-Keyboard-Layout-Optimization.md
date: 2025-03-23 15:46:19
tags:
---

## Karabiner-Elements Config for Mac

`caps_lock` can trade off the press of left small finger with right small finger.

Simple Modifications: `caps_lock` to `left_control`

Complex Modifications: Add your own rule

```json
{
    "description": "caps+ikuo to arrow keys/caps+h caps/semicolon to home/end",
    "manipulators": [
        {
            "from": {
                "key_code": "n",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [
                {
                    "key_code": "left_arrow",
                    "modifiers": ["shift", "left_option"]
                }
            ],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "period",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [
                {
                    "key_code": "right_arrow",
                    "modifiers": ["shift", "left_option"]
                }
            ],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "comma",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [
                {
                    "key_code": "right_arrow",
                    "modifiers": ["shift"]
                }
            ],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "m",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [
                {
                    "key_code": "left_arrow",
                    "modifiers": ["shift"]
                }
            ],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "p",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [
                {
                    "key_code": "right_arrow",
                    "modifiers": ["left_option"]
                }
            ],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "y",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [
                {
                    "key_code": "left_arrow",
                    "modifiers": ["left_option"]
                }
            ],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "j",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [{ "key_code": "delete_or_backspace" }],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "l",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [{ "key_code": "delete_forward" }],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "u",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [{ "key_code": "left_arrow" }],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "semicolon",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [
                {
                    "key_code": "e",
                    "modifiers": ["left_control"]
                }
            ],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "h",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [
                {
                    "key_code": "a",
                    "modifiers": ["left_control"]
                }
            ],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "o",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [{ "key_code": "right_arrow" }],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "i",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [{ "key_code": "up_arrow" }],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "k",
                "modifiers": { "mandatory": ["control"] }
            },
            "to": [{ "key_code": "down_arrow" }],
            "type": "basic"
        }
    ]
}
```



## AutoHotKey for Windows

