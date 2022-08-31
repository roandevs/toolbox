module.exports = (sequelize, DataTypes) => {
    return sequelize.define("projects", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: DataTypes.STRING,
        notes: DataTypes.STRING,
        created_at: DataTypes.DATE,
    })
}