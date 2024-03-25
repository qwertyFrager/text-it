from openai import OpenAI

def main(data):

    client = OpenAI(
      api_key="your key",
      base_url="https://api.proxyapi.ru/openai/v1",
    )

    # creating query to chatGPT
    messages = [
        {"role": "system", "content": "Make a schedule of meetings for tomorrow for two businessmen, the dialogue with which is presented below. The response format should be:" +
                    "-date_1 : time_1 : event_1;" +
                    "-date_2 : time_2 : event_2;" +
                    "and so on..."},
        {"role": "system", "content": "The dialog is here: " + data}
    ]

    print('\nSending message to ChatGPT...')
    completion = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=messages
    )

    print('Waiting for response...')
    chat_response = completion.choices[0].message.content
    print('Response claimed!')

    print(u''+chat_response)

    return u''+chat_response