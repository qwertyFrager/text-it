import whisper
from pyannote.audio import Pipeline
from scripts import utils
from pydub import AudioSegment
import os
import io
import tempfile



def main(sound):
    # Конвертация файла из .m4a в .wav
    sound=io.BytesIO(sound)
    temp_file = tempfile.NamedTemporaryFile(delete=False)

    sound_convert = AudioSegment.from_file(sound, format="m4a")
    sound_convert.export(temp_file, format="wav")

    print(f"Tempfile folder path: {tempfile.gettempdir()}")
    temp_file.close()


    pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization",
                                        use_auth_token="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")
    model = whisper.load_model("base")

    # Распознавание языка + вывод того, какой язык
    print('Detecting language...')
    audio = whisper.load_audio(temp_file.name)
    audio = whisper.pad_or_trim(audio)
    mel = whisper.log_mel_spectrogram(audio).to(model.device)
    _, probs = model.detect_language(mel)
    lang = max(probs, key=probs.get)
    print(f"Detected language: {lang}")

    print('\nTranscribing text from audio...')
    asr_result = model.transcribe(temp_file.name)
    diarization_result = pipeline(temp_file.name)
    final_result = utils.diarize_text(asr_result, diarization_result)

    ans = ''
    for seg, spk, sent in final_result:
        line = f'{spk} {sent}'
        ans += u''+line+'\n'
    
    print('Text has been successfully transcribed and written to file!')

    os.remove(temp_file.name)

    return ans    
