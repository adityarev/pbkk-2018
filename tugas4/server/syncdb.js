import { sequelize } from './db/conn'
import * as models  from './db/models'


sequelize.sync({ force: true })
         .then(_ =>
             models.Group.create({ name: 'Dosen' }))

         .then(_ =>
             models.Group.create({ name: 'Mahasiswa' }))

         .then(mhs => {
             models.Gate.create({ name: 'Plaza Lama 1' })
                        .then(pl1 =>
                            models.Rules.create({ groupId: mhs.id, gateId: pl1.id, open: 6, close: 15 }) )

             models.Gate.create({ name: 'Plaza Baru 1' })
                        .then(pb1 =>
                            models.Rules.create({ groupId: mhs.id, gateId: pb1.id, open: 15, close: 6 }) )

             models.User.create({ groupId: mhs.id, username: 'ronald', password: 'ronald' }) })

         .then(console.log)
         .catch(console.error)
