const adminmodel = require('../models/admin');
const bcrypt = require('bcrypt');

// Login Admin

exports.login = async (req, res) => {
    try {
        const admin = await adminmodel.findOne({ email: req.body.email });
        
        if (!admin) {
            res.render('pages/login', { errors: { email: { message: 'email not found' } } })
            return;
        }

        const match = await bcrypt.compare(req.body.password, admin.password);
        if (match) {
            req.session.userID = admin._id;
            res.redirect('/');
            return
        }

        res.render('pages/login', { errors: { password: { message: 'password does not match' } } })


    } catch (e) {
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}

// Create Admin

exports.create = async (req, res) => {
    try {

        const alreadyexist = await adminmodel.findOne({ email: req.body.email });
        
        if (alreadyexist) 
        {
            res.redirect('/login');
            return
        }


        const admin = new adminmodel({ email: req.body.email, password: req.body.password });
        await admin.save();
        res.redirect('/?message=admin added')
    } catch (e) {
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}