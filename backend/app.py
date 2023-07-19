from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_marshmallow import Marshmallow

from scripts import whisper_transcription
from scripts import chatGPT_response
from scripts import utils

# Create flask object
app = Flask(__name__)


# Adding configuration
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/flaskdb'
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://root:22wPdLYCuH7a8wDopGI9iE5pMa4RSzrO@dpg-cirv29h8g3n42olh0hgg-a:5432/db_srky"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)


"""
#Start model
class Articles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    body = db.Column(db.String(20))
    date = db.Column(db.DateTime, default = datetime.datetime.now)

    def __init__(self, title, body):
        self.title = title
        self.body = body

class ArticleSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'body', 'date')


article_schema = ArticleSchema()
article_schema = ArticleSchema(many=True)

@app.route('/get', methods = ['GET'])
def get_articles():
    all_articles = Articles.query.all()
    results = article_schema.dump(all_articles)
    return jsonify(results)


@app.route('/get/<id>/', methods = ['GET'])
def post_details(id):
    article = Articles.query.get(id)
    return article_schema.jsonify(article)


@app.route('/add', methods = ['POST'])
def add_article():
    title = request.json['title']
    body = request.json['body']

    articles = Articles(title, body)
    db.session.add(articles)
    db.session.commit()
    return article_schema.jsonify(articles)


@app.route('/update/<id>/', methods = ['PUT'])
def update_article(id):
    article = Articles.query.get(id)

    title = request.json['title']
    body = request.json['body']

    article.title = title
    article.body = body

    db.session.commit()
    return article_schema.jsonify(article)


@app.route('/delete/<id>/', methods = ['DELETE'])
def article_delete(id):
    article = Articles.query.get(id)
    db.session.delete(article)
    db.session.commit()

    return article_schema.jsonify(article)
"""


#Audios model
class Audios(db.Model):
    id = db.Column(db.Integer, primary_key=True)    
    data = db.Column(db.LargeBinary(length=(2**32)-1))
    transcription = db.Column(db.String(1023))
    response = db.Column(db.String(1023))

    def __init__(self, data):
        self.data = data  
        self.transcription = None
        self.response = None


class AudioSchema(ma.Schema):
    class Meta:
        fields = ('id', 'data', 'transcription', 'response')        

audio_schema = AudioSchema()
audio_schema = AudioSchema(many=True, exclude=['data'])


#Methods
@app.route('/uploadaudio', methods=['POST'])
def audio_upload():
    file=request.files['file']    
    data=file.read()

    audio = Audios(data=data)
    db.session.add(audio)
    db.session.commit()    

    #Обработка данных
    run_script(audio.id)

    return audio_schema.jsonify(audio)


@app.route('/getaudios', methods = ['GET'])
def get_audios():
    all_audios = Audios.query.all()            
    results = audio_schema.dump(all_audios)
    return jsonify(results)

@app.route('/getaudio/<id>/', methods=['GET'])
def get_audio(id):
    audio_file = Audios.query.get(id)
    if not audio_file:
        return {'message': 'Audio file not found.'}, 404

    # чтение байтовых данных аудиофайла
    audio_data = audio_file.data       

    return audio_data


@app.route('/runscript/<id>/', methods=['PUT'])
def run_script(id):
    print(f"ID: {id}")    
    
    sound = get_audio(id)

    transcription = whisper_transcription.main(sound)
    response = chatGPT_response.main(transcription)

    audio = Audios.query.get(id)    
        
    audio.transcription = transcription
    audio.response = response

    db.session.commit()
    return audio_schema.jsonify(audio)    


@app.route('/deleteaudio/<id>/', methods = ['DELETE'])
def audio_delete(id):
    audio = Audios.query.get(id)
    db.session.delete(audio)
    db.session.commit()

    return audio_schema.jsonify(audio)


@app.route('/updateaudio/<id>/', methods = ['PUT'])
def update_audio(id):
    audio = Audios.query.get(id)

    transcription = request.json['transcription']
    response = request.json['response']

    audio.transcription = transcription
    audio.response = response

    db.session.commit()
    return audio_schema.jsonify(audio)


# Main function
if __name__ == '__main__':
    #DB creation
    with app.app_context():
        db.create_all()
    #App run
    app.run(host='0.0.0.0', port=3000, debug=True)
    # app.run(host='192.168.3.2', port=3000, debug=True)
    # app.run(host='82.148.18.11', port=3000, debug=True)
