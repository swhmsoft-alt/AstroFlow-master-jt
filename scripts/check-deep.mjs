import { Client } from 'basic-ftp';

const client = new Client();
client.ftp.verbose = false;

async function run() {
    await client.access({ host: 'ftp.safetiparts.com', user: 'bozecncti@cnc.bozemetal.com', password: 'tKFvW139C6P3oSG}', port: 21, secure: false });
    await client.send('AUTH', 'TLS');
    await client.send('PBSZ', '0');
    await client.send('PROT', 'P');

    const root = '/home/safetipa/cnc.bozemetal.com/';
    
    const deepPaths = [
        'titanium-cnc-machining-services/3-5-axis-cnc-machining',
        'titanium-cnc-machining-services/cnc-milling-turning',
        'titanium-cnc-machining-services/custom-industrial-components',
        'titanium-cnc-machining-services/wire-edm-machining',
        'titanium-additive-manufacturing/3d-printing-slm',
        'titanium-additive-manufacturing/low-volume-production',
        'titanium-additive-manufacturing/rapid-prototyping',
        'titanium-fabrication-services/laser-cutting',
        'titanium-fabrication-services/titanium-welding-assembly',
        'titanium-fabrication-services/waterjet-cutting',
        'titanium-forming-heavy-manufacturing/raw-material-preparation-sizing',
        'titanium-forming-heavy-manufacturing/titanium-extrusion',
        'titanium-forming-heavy-manufacturing/titanium-forging',
        'titanium-surface-treatment/anodizing',
        'titanium-surface-treatment/chemical-passivation',
        'titanium-surface-treatment/polishing-sandblasting',
        'products/aluminum-cnc-parts',
        'blog/bones-modern',
        'blog/ce-shi',
        'blog/titanium-cnc-machining-services',
        'blog/welcome-to-boze-cnc-blog',
    ];
    
    for (const p of deepPaths) {
        try {
            await client.cd(root + p);
            const files = await client.list();
            const hasIndex = files.find(f => f.name === 'index.html');
            console.log((hasIndex ? 'OK' : 'MISSING') + ' - ' + p);
        } catch (e) {
            if (e.message && e.message.includes('Failed')) {
                console.log('NO_DIR - ' + p);
            } else {
                console.log('ERROR  - ' + p + ': ' + e.message);
            }
        }
    }
    client.close();
}

run().catch(e => { console.error(e.message); client.close(); });