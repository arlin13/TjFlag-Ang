const Court = require('../models/court');

exports.createCourt = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const court = new Court({
    name: req.body.name,
    city: req.body.city,
    address: req.body.address,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    imagePath: req.file
      ? url + '/images/' + req.file.filename
      : url + '/images/page/Court.jpg',
    creator: req.userData.userId
  });
  court
    .save()
    .then(createdCourt => {
      res.status(201).json({
        message: 'Court added successfully',
        court: {
          ...createdCourt,
          id: createdCourt._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Creating a court failed'
      });
    });
};

exports.updateCourt = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const court = new Court({
    _id: req.body.id,
    name: req.body.name,
    city: req.body.city,
    address: req.body.address,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Court.updateOne({ _id: req.params.id, creator: req.userData.userId }, court)
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
        message: "Couldn't update court"
      });
    });
};

exports.getCourts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const courtQuery = Court.find();
  let fetchedCourts;
  if (pageSize && currentPage) {
    courtQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  courtQuery
    .then(documents => {
      fetchedCourts = documents;
      return Court.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Courts fetched succesfully',
        courts: fetchedCourts,
        maxCourts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching courts failed'
      });
    });
};

exports.getCourt = (req, res, next) => {
  Court.findById(req.params.id)
    .then(court => {
      if (court) {
        res.status(200).json(court);
      } else {
        res.status(404).json({ message: 'Court not found!' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Fetching court failed'
      });
    });
};

exports.deleteCourt = (req, res, next) => {
  Court.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successful' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Delete court failed'
      });
    });
};
