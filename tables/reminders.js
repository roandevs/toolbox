module.exports = (sequelize, DataTypes) => {
    return sequelize.define("reminders", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        description: DataTypes.STRING,
        date_set: DataTypes.DATE,
        date_due: DataTypes.DATE,
        reminded: DataTypes.BOOLEAN
    })
}