module.exports = (sequelize, DataTypes) => {
    return sequelize.define("todos", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        description: DataTypes.STRING,
        created_at: DataTypes.DATE,
    })
}