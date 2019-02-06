const Team = require('../models/team');
const Player = require('../models/player');

exports.createTeam = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const team = new Team({
    name: req.body.name,
    city: req.body.city,
    category: req.body.category,
    mode: req.body.mode,
    coach: req.body.coach,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId,
    players: JSON.parse(req.body.players)
  });
  team
    .save()
    .then(createdTeam => {
      res.status(201).json({
        message: 'Team added successfully',
        team: {
          ...createdTeam,
          id: createdTeam._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Creating a team failed'
      });
    });
};

exports.updateTeam = (req, res, next) => {
  let imagePath = req.body.imagePath;
  let players = req.body.players;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  if (typeof req.userData.players === 'string') {
    players = JSON.parse(players);
  }
  const team = new Team({
    _id: req.body.id,
    name: req.body.name,
    city: req.body.city,
    category: req.body.category,
    mode: req.body.mode,
    coach: req.body.coach,
    imagePath: imagePath,
    creator: req.userData.userId,
    players: players
  });
  Team.updateOne({ _id: req.params.id, creator: req.userData.userId }, team)
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
        message: "Couldn't update team"
      });
    });
};

exports.getTeams = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const teamQuery = Team.find();
  let fetchedTeams;
  if (pageSize && currentPage) {
    teamQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  teamQuery
    .then(documents => {
      fetchedTeams = documents;
      return Team.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Teams fetched succesfully',
        teams: fetchedTeams,
        maxTeams: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching teams failed'
      });
    });
};

exports.getTeam = (req, res, next) => {
  Team.findById(req.params.id)
    .populate({ path: 'players', model: Player })
    .then(team => {
      if (team) {
        res.status(200).json(team);
      } else {
        res.status(404).json({ message: 'Team not found!' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Fetching team failed'
      });
    });
};

exports.deleteTeam = (req, res, next) => {
  Team.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successful' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Delete team failed'
      });
    });
};
