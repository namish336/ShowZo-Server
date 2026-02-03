
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function verifyShowFlow() {
    try {
        console.log("1. Fetching Movies and Theaters...");
        // 1. Get a movie and theater
        const moviesRes = await axios.get(`${BASE_URL}/movies`);
        const theatersRes = await axios.get(`${BASE_URL}/theaters`);

        if (!moviesRes.data.movies.length || !theatersRes.data.theaters.length) {
            console.error("No movies or theaters found to test with.");
            return;
        }

        const movie = moviesRes.data.movies[0];
        const theater = theatersRes.data.theaters[0];
        console.log(`> Selected Movie: ${movie.title} (${movie._id})`);
        console.log(`> Selected Theater: ${theater.name} (${theater._id})`);

        // 2. Add a show
        console.log("\n2. Adding a Show...");
        const showDate = new Date();
        showDate.setDate(showDate.getDate() + 1); // Tomorrow
        showDate.setHours(14, 30, 0, 0); // 14:30

        const payload = {
            movie: movie._id,
            theater: theater._id,
            price: 150,
            showTime: showDate.toISOString()
        };

        const addRes = await axios.post(`${BASE_URL}/showtimes/add`, payload);
        if (!addRes.data.success) {
            console.error("Failed to add show:", addRes.data.message);
            return;
        }
        console.log("> Show added successfully:", addRes.data.showtime._id);

        // 3. Fetch shows for that date
        console.log("\n3. Fetching updated shows...");
        // Query params
        const dateStr = showDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const fetchRes = await axios.get(`${BASE_URL}/showtimes`, {
            params: {
                movie: movie._id,
                date: dateStr
            }
        });

        const shows = fetchRes.data.showtimes;
        console.log(`> Found ${shows.length} shows for ${dateStr}`);

        const passed = shows.some(s => s._id === addRes.data.showtime._id);
        if (passed) {
            console.log("SUCCESS: New show found in filtered list!");
        } else {
            console.error("FAILURE: New show NOT found in filtered list.");
            console.log("List:", JSON.stringify(shows, null, 2));
        }

    } catch (error) {
        console.error("Verification failed:", error.response ? error.response.data : error.message);
    }
}

verifyShowFlow();
