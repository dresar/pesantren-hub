const fs = require('fs');
const path = require('path');

// Fix admin/index.ts
const adminPath = path.join(__dirname, 'server/src/modules/admin/index.ts');
let adminCode = fs.readFileSync(adminPath, 'utf8');
adminCode = adminCode.replace(
    /const \[newSantri\] = await db\.insert\(santri\)\.values\(\{([\s\S]*?)createdAt/g,
    "const [newSantri] = await db.insert(santri).values(({$1createdAt"
);
adminCode = adminCode.replace(
    /updatedAt: new Date\(\)\.toISOString\(\),\n  \}\)\.returning\(\);/g,
    "updatedAt: new Date().toISOString(),\n  } as any)).returning();"
);
fs.writeFileSync(adminPath, adminCode);

// Fix core/index.ts
const corePath = path.join(__dirname, 'server/src/modules/core/index.ts');
let coreCode = fs.readFileSync(corePath, 'utf8');
coreCode = coreCode.replace(
    /const \[newItem\] = await db\.insert\(table\)\.values\(insertData as any\)\.returning\(\);/g,
    "const newItemRes = await db.insert(table).values(insertData as any).returning();\n          const newItem = Array.isArray(newItemRes) ? newItemRes[0] : (newItemRes as any).rows[0];"
);
fs.writeFileSync(corePath, coreCode);

console.log("Fixes step 4 applied.");
