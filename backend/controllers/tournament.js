const Tournament = require('../models/tournament');
const Team = require('../models/team');

exports.createTournament = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const tournament = new Tournament({
    name: req.body.name,
    city: req.body.city,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    typeOfGame: req.body.typeOfGame,
    mode: req.body.mode,
    category: req.body.category,
    status: req.body.status,
    imagePath: req.file
      ? url + '/images/' + req.file.filename
      : url + '/images/page/User.png',
    creator: req.userData.userId,
    teams: JSON.parse(req.body.teams)
  });
  tournament
    .save()
    .then(createdTournament => {
      // for (var i = 0; i <= createdTournament.teams.length; i++) {
      //   const teamId = createdTournament.teams[i];
      //   Team.updateOne(
      //     { _id: teamId },
      //     { $push: { tournaments: createdTournament } }
      //   ).catch(error => {
      //     console.log(error);
      //   });
      // }
      res.status(201).json({
        message: 'Tournament added successfully',
        tournament: {
          ...createdTournament,
          id: createdTournament._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Creating a tournament failed'
      });
    });
};

exports.updateTournament = (req, res, next) => {
  let imagePath = req.body.imagePath;
  let teams = req.body.teams;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  if (typeof req.userData.teams === 'string') {
    teams = JSON.parse(teams);
  }
  const tournament = new Tournament({
    _id: req.body.id,
    name: req.body.name,
    city: req.body.city,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    typeOfGame: req.body.typeOfGame,
    mode: req.body.mode,
    category: req.body.category,
    status: req.body.status,
    imagePath: imagePath,
    creator: req.userData.userId,
    teams: teams
  });
  Tournament.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    tournament
  )
    .then(result => {
      for (var i = 0; i <= tournament.teams.length; i++) {
        const teamId = tournament.teams[i];
        const tournamentAlreadyExists = Team.findById(teamId);
        if (!tournamentAlreadyExists) {
          Team.update(
            { _id: teamId },
            { $push: { tournaments: tournament } }
          ).catch(error => {
            console.log(error);
          });
        }
      }
      if (result.n > 0) {
        res.status(200).json({ message: 'Update successful' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't update tournament"
      });
    });
};

exports.getTournaments = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const tournamentQuery = Tournament.find();
  let fetchedTournaments;
  if (pageSize && currentPage) {
    tournamentQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  tournamentQuery
    .then(documents => {
      fetchedTournaments = documents;
      return Tournament.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Tournaments fetched succesfully',
        tournaments: fetchedTournaments,
        maxTournaments: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching tournaments failed'
      });
    });
};

exports.getTournament = (req, res, next) => {
  Tournament.findById(req.params.id)
    .populate({ path: 'teams', model: Team })
    .then(tournament => {
      if (tournament) {
        res.status(200).json(tournament);
      } else {
        res.status(404).json({ message: 'Tournament not found!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching tournament failed'
      });
    });
};

exports.deleteTournament = (req, res, next) => {
  Tournament.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successful' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Delete tournament failed'
      });
    });
};
