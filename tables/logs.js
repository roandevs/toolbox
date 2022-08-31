module.exports = (sequelize, DataTypes) => {
    return sequelize.define("logs", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        description: DataTypes.STRING,
        created_at: DataTypes.DATE
    })
}