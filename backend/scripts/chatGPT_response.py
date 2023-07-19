import openai

def main(data):
    # openai.api_key = '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'
    openai.api_key = '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'
    # openai.api_key = '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'

    # creating query to chatGPT
    messages = [
        {"role": "system", "content": "Make a schedule of meetings for tomorrow for two businessmen, the dialogue with which is presented below. The response format should be:" +
                    "-date_1 : time_1 : event_1;" +
                    "-date_2 : time_2 : event_2;" +
                    "and so on..."},
        {"role": "system", "content": data}
    ]

    print('\nSending message to ChatGPT...')
    completion = openai.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=messages
    )

    print('Waiting for response...')
    chat_response = completion.choices[0].message.content
    print('Response claimed!')

    print(u''+chat_response)

    return u''+chat_response
