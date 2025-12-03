const fs = require('fs');
const path = require('path');

const assetsDir = '/workspaces/Br0x-front-end/src/assets';

const renames = [
    ['6a172e76eea24ecd870d6f0b4d6b692c0d80acce.png', 'eth-logo.png'],
    ['dbd113afd3da7ae206139502102baf0856db17e7.png', 'ada-logo.png'],
    ['c1a44d347e9cddd2da3c6f8f0c1a906523900caf.png', 'bnb-logo.png'],
    ['11f00a29f4e39fa1f20990c65951cba7755a62f9.png', 'polygon-logo.png'],
    ['8a23f41a85c7bff93aa82f203c8d8496753e5b30.png', 'solana-logo.png'],
    ['56f7215ff5ff40ec406f45c63d30a34d0e4695eb.png', 'arbitrum-logo.png'],
    ['9d1a324b2361c5fc0ea4fb5229b41d631ab1ed1a.png', 'avalanche-logo.png'],
    ['82076803a6052f48890cd950757a0088aa20ebc3.png', 'polkadot-logo.png'],
    ['224b52da921ae675cc8e39f8b48f2819fcedf1a3.png', 'fantom-logo.png'],
    ['dda65dde8e41be93a081a6066169244e68c1cbd3.png', 'project-logo.png'],
    ['cdf88002033f44055486f7dfa30e8e32dd79666b.png', 'subwallet-logo.png'],
    ['87e267b72fceea58e435c8d1b46f365b52a7e8c8.png', 'lace-logo.png'],
    ['9bf46c8ae675c8d7f4c58af2e33a8c3dfd58a514.png', 'eternl-logo.png'],
    ['5c18b223369775af8201db53a4dbe7680d52f4fd.png', 'metamask-logo.png'],
    ['0836fcef9cfad78811d99a8c6666fe4455476a75.png', 'okx-logo.png'],
];

renames.forEach(([oldName, newName]) => {
    const oldPath = path.join(assetsDir, oldName);
    const newPath = path.join(assetsDir, newName);
    
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`✓ Renamed: ${oldName} -> ${newName}`);
    } else {
        console.log(`✗ Not found: ${oldName}`);
    }
});

console.log('\nFiles after renaming:');
const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png')).sort();
files.forEach(f => console.log(f));
