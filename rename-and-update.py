#!/usr/bin/env python3
"""
Simple script to rename PNG files and update imports in source files
"""
import os
import shutil
from pathlib import Path

# Map hash names to new names
RENAME_MAP = {
    'dda65dde8e41be93a081a6066169244e68c1cbd3.png': 'project-logo.png',
    'cdf88002033f44055486f7dfa30e8e32dd79666b.png': 'subwallet-logo.png',
    '87e267b72fceea58e435c8d1b46f365b52a7e8c8.png': 'lace-logo.png',
    '9bf46c8ae675c8d7f4c58af2e33a8c3dfd58a514.png': 'eternl-logo.png',
    '5c18b223369775af8201db53a4dbe7680d52f4fd.png': 'metamask-logo.png',
    '0836fcef9cfad78811d99a8c6666fe4455476a75.png': 'okx-logo.png',
    '6a172e76eea24ecd870d6f0b4d6b692c0d80acce.png': 'eth-logo.png',
    'dbd113afd3da7ae206139502102baf0856db17e7.png': 'ada-logo.png',
    'c1a44d347e9cddd2da3c6f8f0c1a906523900caf.png': 'bnb-logo.png',
    '11f00a29f4e39fa1f20990c65951cba7755a62f9.png': 'polygon-logo.png',
    '8a23f41a85c7bff93aa82f203c8d8496753e5b30.png': 'solana-logo.png',
    '56f7215ff5ff40ec406f45c63d30a34d0e4695eb.png': 'arbitrum-logo.png',
    '9d1a324b2361c5fc0ea4fb5229b41d631ab1ed1a.png': 'avalanche-logo.png',
    '82076803a6052f48890cd950757a0088aa20ebc3.png': 'polkadot-logo.png',
    '224b52da921ae675cc8e39f8b48f2819fcedf1a3.png': 'fantom-logo.png',
}

# Files to update
FILES_TO_UPDATE = [
    'src/components/shared/Header.tsx',
    'src/components/shared/BlockchainData.tsx',
    'src/components/UserLiquidityPage.tsx',
    'src/components/TransactionHistory.tsx',
    'vite.config.ts'
]

def rename_files(assets_dir):
    """Rename all PNG files in assets directory"""
    print("Step 1: Renaming PNG files...")
    for old_name, new_name in RENAME_MAP.items():
        old_path = os.path.join(assets_dir, old_name)
        new_path = os.path.join(assets_dir, new_name)
        
        if os.path.exists(old_path):
            shutil.move(old_path, new_path)
            print(f"  ✓ {old_name} → {new_name}")
        else:
            print(f"  ✗ File not found: {old_name}")

def update_imports(base_dir):
    """Update import statements in source files"""
    print("\nStep 2: Updating imports in source files...")
    
    for file_path in FILES_TO_UPDATE:
        full_path = os.path.join(base_dir, file_path)
        
        if not os.path.exists(full_path):
            print(f"  ✗ File not found: {file_path}")
            continue
        
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        updated = False
        for old_hash, new_name in RENAME_MAP.items():
            if old_hash in content:
                content = content.replace(old_hash, new_name)
                updated = True
        
        if updated:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Updated: {file_path}")
        else:
            print(f"  - No changes needed: {file_path}")

if __name__ == '__main__':
    base_dir = '/workspaces/Br0x-front-end'
    assets_dir = os.path.join(base_dir, 'src/assets')
    
    print("Starting asset renaming and import updates...\n")
    
    rename_files(assets_dir)
    update_imports(base_dir)
    
    print("\n✓ All done!")
    print("\nFiles renamed:")
    for old, new in RENAME_MAP.items():
        print(f"  {old} → {new}")
