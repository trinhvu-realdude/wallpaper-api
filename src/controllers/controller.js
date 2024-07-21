const fs = require("fs");

exports.getCategories = (req, res) => {
    const data = fs.readFileSync("data/categories.json");
    const categories = JSON.parse(data);

    res.send({results: categories});
};

exports.getTagsByCategory = (req, res) => {
    const category = req.params.category;
    const data = fs.readFileSync(`data/${category}/${category}-tags.json`);
    const results = JSON.parse(data);

    res.send({results: results});
};

exports.getImagesByTag = (req, res) => {
    const category = req.params.category;
    const tag = req.params.tag;
    const title = req.body.title;

    const data = fs.readFileSync(`data/${category}/${title}/${tag}.json`)
    const results = JSON.parse(data);

    res.send({results: results});
};

exports.getRandomTags = (req, res) => {
    let results = [];
    const resolutionSet = new Set();

    // get tags
    const dataCategories = fs.readFileSync("data/categories.json");
    const categories = JSON.parse(dataCategories);

    categories.forEach(category => {
        const dataTags = fs.readFileSync(`data/${category.name}/${category.name}-tags.json`);
        const tags = JSON.parse(dataTags);

        tags.forEach(tag => {
            try {
                const dataImages = fs.readFileSync(`data/${category.name}/${tag.folderName}/${tag.url.replace("/", "")}.json`);
                const images = JSON.parse(dataImages);

                images.forEach(image => {
                    resolutionSet.add(image.resolution);
                })
            } catch(e) {
                console.error(`${e}`);
            }
        })
        
        const random = Math.floor(Math.random() * tags.length);

        results.push(tags[random]);
    });

    let resolutions = [];

    for (let i = 0; i < 20; i++) {
        const random = Math.floor(Math.random() * resolutionSet.size);  
        resolutions.push([...resolutionSet][random]);
    }

    res.send({results: results, resolutions: resolutions});
};

exports.searchTags = (req, res) => {
    let results = [];

    const query = req.query.q;

    const dataCategories = fs.readFileSync("data/categories.json");
    const categories = JSON.parse(dataCategories);

    const half = categories.splice(0, categories.length/2);

    [...categories, ...half].forEach(category => {
        const dataTags = fs.readFileSync(`data/${category.name}/${category.name}-tags.json`);
        const tags = JSON.parse(dataTags);

        for (let i = 0; i < tags.length; i++) {
            if (tags[i].name.toLowerCase().includes(query.toLowerCase())) {
                results.push(tags[i]);
            }
        }
    });

    res.send({
        length: results.length,
        results
    });
};

exports.getRelatedTags = (req, res) => {
    let results = [];
    const {category, currentTag} = req.body;
    const data = fs.readFileSync(`data/${category}/${category}-tags.json`);
    const tags = JSON.parse(data);

    for (let i = 0; i < 6; i++) {
        const newList = tags.filter(tag => tag.title !== currentTag);
        results.push(newList[i]);  
    }
    
    res.send({results: results});
}

exports.getImagesByResolution = (req, res) => {
    let results = [];

    const resolution = req.params.resolution;

    const dataCategories = fs.readFileSync("data/categories.json");
    const categories = JSON.parse(dataCategories);

    categories.forEach(category => {
        const dataTags = fs.readFileSync(`data/${category.name}/${category.name}-tags.json`);
        const tags = JSON.parse(dataTags);
        
        tags.forEach(tag => {
            try {
                const dataImages = fs.readFileSync(`data/${category.name}/${tag.folderName}/${tag.url.replace("/", "")}.json`);
                const images = JSON.parse(dataImages);

                images.forEach(image => {
                    if (image.resolution === resolution) {
                        results.push(image);
                    }
                })
            } catch(e) {
                console.error(`${e}`);
            }
        })
    });

    res.send({results: results});
}