class Config: #confs gerais
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db' #URL DO BANCO AQUI
    JWT_SECRET_KEY = "andrezitoprisquito"
    JWT_ACCESS_TOKEN_EXPIRES = 3600