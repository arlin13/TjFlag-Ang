const Player = require('../models/player');

exports.createPlayer = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const player = new Player({
    name: req.body.name,
    lastname: req.body.lastname,
    dateOfBirth: req.body.dateOfBirth,
    sex: req.body.sex,
    number: req.body.number,
    division: req.body.division,
    status: 'Active',
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  player
    .save()
    .then(createdPlayer => {
      res.status(201).json({
        message: 'Player added successfully',
        player: {
          ...createdPlayer,
          id: createdPlayer._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a player failed'
      });
    });
};

exports.updatePlayer = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const player = new Player({
    _id: req.body.id,
    name: req.body.name,
    lastname: req.body.lastname,
    dateOfBirth: req.body.dateOfBirth,
    sex: req.body.sex,
    number: req.body.number,
    division: req.body.division,
    status: req.body.status,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Player.updateOne({ _id: req.params.id, creator: req.userData.userId }, player)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Update successful' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't update player"
      });
    });
};

exports.getPlayers = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const playerQuery = Player.find();
  let fetchedPlayers;
  if (pageSize && currentPage) {
    playerQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  playerQuery
    .then(documents => {
      fetchedPlayers = documents;
      return Player.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Players fetched succesfully',
        players: fetchedPlayers,
        maxPlayers: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching players failed'
      });
    });
};

exports.getPlayer = (req, res, next) => {
  Player.findById(req.params.id)
    .then(player => {
      if (player) {
        res.status(200).json(player);
      } else {
        res.status(404).json({ message: 'Player not found!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching player failed'
      });
    });
};

exports.deletePlayer = (req, res, next) => {
  Player.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successful' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Delete player failed'
      });
    });
};
