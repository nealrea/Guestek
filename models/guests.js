'use strict';
module.exports = (sequelize, DataTypes) => {
  var Guests = sequelize.define('Guests', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalSpent: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    avgSpent: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    favItem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    allergies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    lastOrder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    genInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    numVisits: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lastOrderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    hooks: {
      afterCreate: (guest => {
        sequelize.models.ItemsOrdered.create({
          GuestId: guest.id,
          ItemId: guest.lastOrderId,
          timesOrdered: 1,
        })
      }),
      afterBulkUpdate: (guest => {
        var guestId = guest.attributes.id;
        var guestLastOrderId = guest.attributes.lastOrderId;
        console.log(guest.attributes.id);
        sequelize.models.ItemsOrdered.findOne({
          where: {
            GuestId: guest.attributes.id,
            ItemId: guest.attributes.lastOrderId,
          }
        }).then(items => {
          if(items){
            sequelize.models.ItemsOrdered.findOne({
              where: {
                GuestId: guestId,
                ItemId: guestLastOrderId,
              }
            }).then(currGuest => {
              sequelize.models.ItemsOrdered.update({
                timesOrdered: currGuest.timesOrdered + 1,
              },
              {
                where: {
                  GuestId: guestId,
                  ItemId: guestLastOrderId,
                }
              });
            });
          }else{
            sequelize.models.ItemsOrdered.create({
              GuestId: guestId,
              ItemId: guestLastOrderId,
              timesOrdered: 1,
            })
          }
        });
      })
    }
  });
  Guests.associate = (models) => {
    models.Guests.hasMany(models.ItemsOrdered)
  };
  //sequelize.sync();
  return Guests;
};