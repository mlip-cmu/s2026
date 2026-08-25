# Lab 1: Kafka for Data Streaming

In this lab, you will gain hands-on experience with Apache Kafka, a distributed streaming platform that plays a key role in processing large-scale real-time data. You will establish a connection to a Kafka broker, produce and consume messages, and explore Kafka command-line tools. This lab will prepare you for your group project, where you'll work with Kafka streams. 

To receive credit for this lab, show your work to the TA during recitation.

## Deliverables
- [ ] Establish a secure SSH tunnel to the Kafka server. Explain to the TA the concepts of topic and offsets in Kafka and how this ensures message continuity if a consumer is disconnected.
- [ ] Modify starter code to implement producer and consumer modes for a Kafka topic. Explain the tradeoffs of the different *auto_offset_reset* values. Then find the valid offset range for your topic and use `seek()` to replay it from three different starting offsets across that range — explain to the TA which of them `auto_offset_reset` could have reached on its own, and which needed `seek()`.
- [ ] Demonstrate using Kafka's CLI tool *kcat* (or alternatives) to manage and monitor Kafka topics and messages, including consuming from an absolute offset in the middle of the log.


## Getting started
- Clone the starter code from this [Git repository](https://github.com/AshrithaG/mlip-kafka-lab).
- The repository includes a python notebook for Kafka producer and consumer model.
- Set up a Python virtual environment (recommended):
  ```bash
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  ```

**Having issues?** Check the [bug list and solutions](https://github.com/AshrithaG/mlip-kafka-lab/blob/main/bug_list.md) for common problems and troubleshooting tips.

## Connecting to Kafka server
1. Use SSH to create a tunnel to the Kafka server (find remote_server, user, and password on the Canvas entry for this lab):  
   ```bash
   ssh -L <local_port>:localhost:<remote_port> <user>@<remote_server> -NTf
   ```
   **Important**: Use the same `<local_port>` throughout the lab (e.g., 9092). This port will be your `bootstrap_servers` address.

2. Test the Kafka server connection to ensure it's operational.

## Implementing Producer-Consumer Mode
### 1. Producer Mode: Writes Data to Broker
Refer to TODO sections in the notebook. Edit the bootstrap servers and add 2-3 cities of your choice as `(city, temperature_f)` pairs. Run the code to write to the Kafka stream — it sends 20 messages over ~10 seconds and prints the offsets Kafka assigned them. Keep that offset range handy; you will read back from different points inside it in step 3.

### 2. Consumer Mode: Reads Data from Broker
Modify the TODO section by filling appropriate parameters/arguments in the starter code. Verify `kafka_log.csv`.  

### 3. Reading From the Middle of the Log
`auto_offset_reset` only picks between the two *ends* of the log — `earliest` (the log start offset) and `latest` (the high watermark) — and Kafka only applies it when a consumer has no valid committed offset. It cannot start you anywhere in between, which is what real consumers need: replay the last 50 messages, resume shortly before a crash.

In the *Reading From the Middle of the Log* cell of the notebook, use `beginning_offsets()` and `end_offsets()` to find the valid range, then `seek()` to **three** offsets spread across it — not just the two ends. A `read_from()` helper is provided, so this is two short TODOs.

Ref:  
[KafkaProducer Documentation](https://kafka-python.readthedocs.io/en/master/apidoc/KafkaProducer.html)  
[KafkaConsumer Documentation](https://kafka-python.readthedocs.io/en/master/apidoc/KafkaConsumer.html)

## Using Kafka's CLI tools
`kcat` is a CLI (Command Line Interface). Previously known as kafkacat.  
Install with your package installer such as:
- macOS: `brew install kcat`
- Ubuntu: `apt-get install kcat`
- Note for Windows Users: Setting up kcat on Windows is complex. Please work in pairs with someone with mac/Ubuntu during recitation for this deliverable. The purpose is to understand CLI which will be helpful in the group project for using Kafka on Virtual machines (Linux based).

Using the kcat documentation, write a command that connects to the local Kafka broker, specifies a topic, and consumes messages from the earliest offset. Use `-f "%o: %s\n"` so the offset of each message is visible. Then run the same command again from an **absolute offset in the middle of your range** (e.g. `-o 8`) and check the offsets match what your Python consumer showed.

For reference, `-o` accepts more than the two ends — useful in the group project:

| `-o` form | meaning |
| --- | --- |
| `-o beginning` / `-o end` | the two ends of the log |
| `-o <N>` | an absolute offset, e.g. `-o 8` |
| `-o -<N>` | relative to the end, e.g. `-o -5` for the last 5 messages |
| `-o s@<ms>` | first message at/after a timestamp (ms since epoch) |

Ref:\
  [kcat usage](https://docs.confluent.io/platform/current/app-development/kafkacat-usage.html)  
  [kcat GitHub](https://github.com/edenhill/kcat)   

## Optional but Recommended
For your group project you will be reading movies from the Kafka stream. Try finding the list of all topics and then read some movielog streams to get an idea of what the data looks like:  
`kcat -b localhost:9092 -L`

Two more offset tricks worth knowing before the project, if you have time left over:
- **Seek by time instead of by number.** `consumer.offsets_for_times({tp: <ms since epoch>})` resolves a timestamp to the first offset at or after it — this is how you replay "everything since 09:00". Watch out: the timestamp must be in *milliseconds*.
- **Seek out of range on purpose.** Try `seek()` to an offset past the high watermark. Whether you get an exception, a silent jump to one end, or nothing at all depends entirely on your `auto_offset_reset` value — which is a good way to see that it is a *fallback policy*, not a starting position.

## Additional resources
- [Kafka Introduction Video 1](https://www.youtube.com/watch?v=PzPXRmVHMxI) <- Recommended video for a quick 5-min introduction to Kafka
- [Kafka Introduction Video 2](https://www.youtube.com/watch?v=JalUUBKdcA0)
- [Apache Kafka](https://kafka.apache.org/)
- [Kafka for Beginners](https://www.cloudkarafka.com/blog/2016-11-30-part1-kafka-for-beginners-what-is-apache-kafka.html)
- [What is Apache Kafka? - TIBCO](https://www.tibco.com/reference-center/what-is-apache-kafka)
- [Common bugs and solutions](https://github.com/AshrithaG/mlip-kafka-lab/blob/main/bug_list.md) - Troubleshooting guide for connection issues, code errors, and environment setup
