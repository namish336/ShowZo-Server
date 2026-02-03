import https from 'https';
import http from 'http';
import { URL } from 'url';

const urlsToCheck = [
    // Blade
    "https://upload.wikimedia.org/wikipedia/commons/c/c3/Mahershala_Ali_2019.jpg",
    "https://upload.wikimedia.org/wikipedia/en/thumb/1/19/Blade_poster.jpg/220px-Blade_poster.jpg",

    // Demon Slayer
    "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Demon_Slayer_Kimetsu_no_Yaiba_-_To_the_Swordsmith_Village.jpg/220px-Demon_Slayer_Kimetsu_no_Yaiba_-_To_the_Swordsmith_Village.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Kimetsu_no_Yaiba_logo.svg/1200px-Kimetsu_no_Yaiba_logo.svg.png",

    // Scream 7
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Scream_logo.svg/1200px-Scream_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Scream_%281996_film%29_poster.jpg/220px-Scream_%281996_film%29_poster.jpg",

    // Batman
    "https://upload.wikimedia.org/wikipedia/commons/e/ed/The_Batman_2022_film_logo.png",
    "https://upload.wikimedia.org/wikipedia/en/f/ff/The_Batman_%28film%29_poster.jpg",

    // Mario
    "https://upload.wikimedia.org/wikipedia/commons/0/05/The_Super_Mario_Bros._Movie_logo.png",
    "https://upload.wikimedia.org/wikipedia/en/4/44/The_Super_Mario_Bros._Movie_poster.jpg",

    // Avengers
    "https://upload.wikimedia.org/wikipedia/en/f/f9/TheAvengers2012Poster.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg",

    // Swayambhu
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Nikhil_Siddhartha_at_Karthikeya_2.jpg",

    // Border 2
    "https://upload.wikimedia.org/wikipedia/commons/1/13/Sunny_Deol_Still_at_Singh_Saab_The_Great_First_Look_Launch.jpg",

    // Project Hail Mary
    "https://upload.wikimedia.org/wikipedia/commons/f/f6/Ryan_Gosling_in_2018.jpg",

    // Tu Ya Main
    "https://upload.wikimedia.org/wikipedia/commons/c/ce/Vikrant_Massey_2019.jpg",

    // Dhurandhar
    "https://upload.wikimedia.org/wikipedia/commons/cc/Ranveer_Singh_promoting_Befikre.jpg",

    // Mandalorian
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_Mandalorian_logo.svg/1200px-The_Mandalorian_logo.svg.png", // Guessing exact path, usually safest is the page URL but we need image. 
    // Let's try to verify this specific one or use one we can find easily.
    "https://upload.wikimedia.org/wikipedia/en/a/a2/The_Mandalorian_season_3_poster.jpg",

    // SSMB29
    "https://upload.wikimedia.org/wikipedia/commons/9/9a/Mahesh_Babu_in_Spyder_event.jpg",

    // Toy Story 5
    "https://upload.wikimedia.org/wikipedia/en/4/4c/Toy_Story_4_poster.jpg",

    // Kalki 2898 AD Part 2
    "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD_poster.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/a2/Prabhas_at_Saaho_promotions.jpg",

    // Your Name
    "https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png"
];

async function checkUrl(urlString) {
    return new Promise((resolve) => {
        try {
            const url = new URL(urlString);
            const client = url.protocol === 'https:' ? https : http;
            const options = {
                method: 'HEAD',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                }
            };

            const req = client.request(urlString, options, (res) => {
                if (res.statusCode === 200) {
                    const contentType = res.headers['content-type'];
                    if (contentType && contentType.startsWith('image/')) {
                        resolve({ url: urlString, status: 'OK', type: contentType });
                    } else {
                        resolve({ url: urlString, status: 'NOT_IMAGE', type: contentType || 'unknown' });
                    }
                } else {
                    resolve({ url: urlString, status: 'ERROR', code: res.statusCode });
                }
            });

            req.on('error', (e) => {
                resolve({ url: urlString, status: 'FAILED', error: e.message });
            });

            req.end();
        } catch (e) {
            resolve({ url: urlString, status: 'INVALID_URL', error: e.message });
        }
    });
}

// Export for now or just run it
export async function verifyUrls(urls) {
    console.log("Verifying " + urls.length + " URLs...");
    const results = await Promise.all(urls.map(checkUrl));
    results.forEach(r => {
        if (r.status === 'OK') console.log(`[PASS] ${r.url}`);
        else console.error(`[FAIL] ${r.status} (${r.code || r.type || r.error}) - ${r.url}`);
    });
    return results;
}

verifyUrls(urlsToCheck);
