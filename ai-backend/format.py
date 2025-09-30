import json

with open("dialogs.json", "r") as f:
    dialogs = json.load(f)

train_samples = []

for conv in dialogs.values():
    uttrs = conv["utterances"]
    context = []
    for i, uttr in enumerate(uttrs):
        line = f'{uttr["speaker"]}: {uttr["text"]}'
        context.append(line)
        # if next is doctor, add as training sample
        if uttr["speaker"] == "doctor" and i > 0:
            previous_context = "\n".join(context[:-1])
            doctor_reply = line
            sample = {
                "input": previous_context,
                "output": doctor_reply
            }
            train_samples.append(sample)

with open("doctor-roleplay-train.json", "w") as f:
    json.dump(train_samples, f, indent=2)
