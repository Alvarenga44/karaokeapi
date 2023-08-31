const Songs = require('../models/Songs')

module.exports = {
	async songsReports(req, res) {
			try {
				const { company_id } = req.headers;

				const approvedSongs = await Songs.findAndCountAll({
					where: {
						company_id,
						status: 'approved'
					}
				});

				const canceledSongs = await Songs.findAndCountAll({
					where: {
						company_id,
						status: 'canceled'
					}
				});

				return res.json({
					approvedSongs,
					canceledSongs
				})

			} catch(error) {
				console.log(error)
				let e = [];
				e.push(error);
				return res.status(500).json({
					title: 'Falha ao inserir música, tente novamente',
					e
				})
			}
	}
}