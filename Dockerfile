FROM python

WORKDIR /code

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY backend/ .

CMD [ "python", "./app.py" ]