const fs = require('fs');
const path = require('path');

const files = [
    'server/src/modules/core/index.ts',
    'server/src/modules/blog/index.ts',
    'server/src/modules/publication/publication.controller.ts',
    'server/src/modules/admin/index.ts',
    'server/src/modules/media/media.service.ts'
];

for (const file of files) {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) continue;
    
    let code = fs.readFileSync(fullPath, 'utf8');

    // Fix Hono param types
    code = code.replace(/parseInt\((c\.req\.param\('[^']+'\))\)/g, "parseInt($1 as string)");
    code = code.replace(/PublicationService\.getArticleBySlug\(slug\)/g, "PublicationService.getArticleBySlug(slug as string)");

    // Core index specific fixes
    if (file.includes('core/index.ts')) {
        // Fix TS2488: Type 'any[] | QueryResult<never>' must have a '[Symbol.iterator]()'
        code = code.replace(/const \[inserted\] = \(await db\.insert\(table\)\.values\(insertData as any\)\.returning\(\)\) as any\[\];/g, 
            "const insertedRes = await db.insert(table).values(insertData as any).returning();\n    const inserted = Array.isArray(insertedRes) ? insertedRes[0] : (insertedRes as any).rows[0];");
        
        // At line 454: const [updated] = await db.update(table).set(updateData as any).where(eq(table.id, id)).returning();
        // Replacing just the returning() part
        code = code.replace(/const \[updated\] = await db\.update\(table\)\.set\(updateData as any\)\.where\(eq\(table\.id, id\)\)\.returning\(\);/g,
            "const updatedRes = await db.update(table).set(updateData as any).where(eq(table.id, id)).returning();\n    const updated = Array.isArray(updatedRes) ? updatedRes[0] : (updatedRes as any).rows[0];");
            
        // At line 41: const res = await db.execute(sql`SELECT 1 as ok`);
        // At line 43: const isOk = res.rows ? res.rows[0]?.ok === 1 : (res as any)[0]?.ok === 1;
        // There's another db.execute at line 319, 322, 323, 335... these are fine because rows are used.
        // Wait, where is line 453 error TS2488? 
        // "server/src/modules/core/index.ts(453,11): error TS2488: Type 'any[] | QueryResult<never>' must have a '[Symbol.iterator]()'"
        // Line 453 is "const [updated] = await db.update(table)...returning();"
    }

    if (file.includes('media/media.service.ts')) {
         // Fix number | null vs number | undefined
         code = code.replace(/performedBy: userId/g, "performedBy: userId ?? null");
         // Fix eq(accountId)
         code = code.replace(/eq\(mediaAccounts\.id, file\.accountId\)/g, "eq(mediaAccounts.id, file.accountId as number)");
    }
    
    fs.writeFileSync(fullPath, code);
}
console.log('Fixed TS errors step 2');
