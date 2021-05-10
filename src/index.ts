import { ApiServer } from './server';
import { getMessage } from './message';
import { TestController } from './api.controllers/testController';
import { RootController } from './api.controllers/rootController';
import fs, { read } from 'fs';
import readline from 'readline';
import https from 'https';

const filename = './data/listall.txt';

const TIMEOUT = 1000;

const map = new Map<number,number>();

const main = async () => {
    const p = new Promise<void>((resolve, reject) => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(filename),
            output: process.stdout,
            terminal: false
        });
    
        const lines: string[] = [];
    
        readInterface.on('line', function(line) {
            lines.push(line);
        });
    
        readInterface.on('close', async function() {
            for (let i = 0; i < lines.length; i++) {
                await readLine(i, lines[i]);
            }
            resolve();
        })
    
    });
    p.then(() => {
        for (let i = 0; i < map.size; i++) {
            console.log(map.get(i));
        }
    })

}

async function readLine(i: number, line: string) {
    return new Promise<void>((resolve, reject) => {
        // console.log(line);
        callAPI(i, line);
        setTimeout(() => {
            resolve();
        }, TIMEOUT);
    })
}

async function callAPI(i: number, url: string) {
    return new Promise<void>((resolve, reject) => {
        https.get(url, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });
    
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                const response = JSON.parse(data).Response;
                if (response !== 'Success') {
                    reject(data);
                }
                const dataRate = JSON.parse(data).Data.Data;
                map.set(i, (dataRate[1].close + dataRate[1].open)/2);
                resolve();
            })
        })
    })
}

main().catch(e => {
    console.error(e);
});
  