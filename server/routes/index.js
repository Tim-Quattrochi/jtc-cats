const { Router } = require("express");
const fs = require("fs");

const router = Router();

/**
 * GET /api/cats/:breed
 * @param req.params.breed - the breed of the cat
 */
router.get("/cats/:breed", (req, res) => {
  const { breed } = req.params;
  const options = {
    headers: {
      "x-api-key": process.env.CAT_API_KEY,
    },
  };

  /**
   * Check if the breed is already saved in the "cats" dir
   * If yes, send the data from the file
   * If not, call the getCat function
   * @param {Express.Response} res
   */
  const checkForBreed = (res) => {
    fs.readdir("./cats", (err, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      } else {
        let found = false;
        files.forEach((file) => {
          const data = fs.readFileSync(`./cats/${file}`);
          const persistedCat = JSON.parse(data);

          if (persistedCat[0]["name"].toLowerCase().includes(breed)) {
            found = true;
            return res.status(200).send(persistedCat);
          }
        });

        if (!found) {
          getCat();
        }
      }
    });
  };

  const getCat = async () => {
    try {
      const response = await fetch(
        `https://api.thecatapi.com/v1/breeds/search?q=${breed}`,
        options
      );

      const data = await response.json();
      let id = data[0]["image"]["id"];

      //save data to file to the "cats" dir
      fs.writeFileSync(`./cats/${id}.json`, JSON.stringify(data));
      return res.status(201).send(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  checkForBreed(res);
});

router.put("/cats/:id", (req, res) => {
  console.log("REQ BODY:", req.body);
  const { id } = req.params;
  const { name } = req.body; // nickname

  //find cat by id and change the name
  fs.readdir("./cats", (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    } else {
      let found = false;
      files.forEach((file) => {
        const data = fs.readFileSync(`./cats/${file}`);
        const persistedCat = JSON.parse(data);

        if (persistedCat[0]["image"]["id"] === id) {
          persistedCat[0]["nickName"] = name;
          fs.writeFileSync(
            `./cats/${file}`,
            JSON.stringify(persistedCat)
          );
          found = true;
          return res.status(200).send(persistedCat);
        }
      });

      if (!found) {
        return res.status(404).json({ message: "Cat not found" });
      }
    }
  });
});

router.delete("/cats/:id", (req, res) => {
  const { id } = req.params;

  fs.readdir("./cats", (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    } else {
      let found = false;
      files.forEach((file) => {
        const data = fs.readFileSync(`./cats/${file}`);
        const persistedCat = JSON.parse(data);

        if (persistedCat[0]["image"]["id"] === id) {
          fs.unlinkSync(`./cats/${file}`);
          found = true;
          return res.status(200).json({ message: "Cat deleted" });
        }
      });

      if (!found) {
        return res.status(404).json({ message: "Cat not found" });
      }
    }
  });
});

module.exports = router;
