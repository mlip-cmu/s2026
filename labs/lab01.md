# Lab 1: Kafka for Data Streaming

In this lab, you will gain hands-on experience with Apache Kafka, a distributed streaming platform that plays a key role in processing large-scale real-time data. You will establish a connection to a Kafka broker, produce and consume messages, and explore Kafka command-line tools. This lab will prepare you for your group project, where you'll work with Kafka streams. 

To receive credit for this lab, show your work to the TA during recitation.

## Deliverables
- [ ] Establish a secure SSH tunnel to the Kafka server. Explain to the TA the concepts of topic and offsets in Kafka and how this ensures message continuity if a consumer is disconnected.
- [ ] Modify starter code to implement producer and consumer modes for a Kafka topic. Explain the tradeoffs of the different *auto_offset_reset* values, and *when* Kafka actually applies them.
- [ ] Determine the valid offset range for your topic and replay it from at least four different starting offsets spread across that range, including one interior offset and one resolved from a timestamp. Show the TA your filled-in results table and explain why `earliest`/`latest` alone are not enough for a real consumer.
- [ ] Demonstrate using Kafka's CLI tool *kcat* (or alternatives) to manage and monitor Kafka topics and messages, including consuming from an absolute offset, an offset relative to the end of the log, and a timestamp.


## Getting started
- Clone the starter code from this [Git repository](https://github.com/AshrithaG/mlip-lab-1/tree/main).
- The repository includes a python notebook for Kafka producer and consumer model.
- Set up a Python virtual environment (recommended):
  ```bash
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  ```

**Having issues?** Check the [bug list and solutions](./bug_list.md) for common problems and troubleshooting tips.

## Connecting to Kafka server
1. Use SSH to create a tunnel to the Kafka server (find remote_server, user, and password on the Canvas entry for this lab):  
   ```bash
   ssh -L <local_port>:localhost:<remote_port> <user>@<remote_server> -NTf
   ```
   **Important**: Use the same `<local_port>` throughout the lab (e.g., 9092). This port will be your `bootstrap_servers` address.

2. Test the Kafka server connection to ensure it's operational.

## Implementing Producer-Consumer Mode
### 1. Producer Mode: Writes Data to Broker
Refer to TODO sections in the notebook. Edit the bootstrap servers and add 2-3 cities of your choice as `(city, temperature_f)` pairs. Run the code to write to the Kafka stream — it sends 25 messages over ~13 seconds and prints the offsets Kafka assigned them. Keep that offset range handy; you will read back from different points inside it in step 3.

### 2. Consumer Mode: Reads Data from Broker
Modify the TODO section by filling appropriate parameters/arguments in the starter code. Verify `kafka_log.csv`.  

### 3. Exploring the Offset Range
`auto_offset_reset` only picks between the two *boundaries* of the log — `earliest` (the log start offset) and `latest` (the high watermark) — and Kafka only applies it when a consumer has no valid committed offset. Real consumers routinely need to start *inside* the range: replay the last 50 messages, resume shortly before a crash, or re-read everything since a given time.

In the *Exploring the Offset Range* section of the notebook:
1. Use `beginning_offsets()` and `end_offsets()` to determine the valid range `[log start offset, high watermark)` for your topic.
2. Use `seek()` to read from at least **four** different offsets spread across that range — not just the two ends. Compare which messages you get from each.
3. Use `offsets_for_times()` to resolve a timestamp from the middle of your producer run into an offset, then read from it.
4. Deliberately seek **outside** the valid range and record what happens. Connect that behaviour back to the `auto_offset_reset` value you configured.

Record your results in the answer table in the last notebook cell.

Ref:  
[KafkaProducer Documentation](https://kafka-python.readthedocs.io/en/master/apidoc/KafkaProducer.html)  
[KafkaConsumer Documentation](https://kafka-python.readthedocs.io/en/master/apidoc/KafkaConsumer.html)

## Using Kafka's CLI tools
`kcat` is a CLI (Command Line Interface). Previously known as kafkacat.  
Install with your package installer such as:
- macOS: `brew install kcat`
- Ubuntu: `apt-get install kcat`
- Note for Windows Users: Setting up kcat on Windows is complex. Please work in pairs with someone with mac/Ubuntu during recitation for this deliverable. The purpose is to understand CLI which will be helpful in the group project for using Kafka on Virtual machines (Linux based).

Using the kcat documentation, write commands that connect to the local Kafka broker, specify a topic, and consume messages. Start from the earliest offset, then use the other forms `-o` accepts to start from several different points across the valid range:

| `-o` form | meaning |
| --- | --- |
| `-o beginning` / `-o end` | the two boundaries |
| `-o <N>` | an absolute offset, e.g. `-o 7` |
| `-o -<N>` | relative to the end, e.g. `-o -5` for the last 5 messages |
| `-o s@<ms>` | first message at/after a timestamp (ms since epoch) |
| `-o e@<ms>` | stop at a timestamp — pair with `s@` to read a time window |

Run at least three of the non-boundary forms, use `-f "%o %T: %s\n"` so the offset and timestamp are visible, and try one offset past the end of the log to see how kcat reacts.

Ref:\
  [kcat usage](https://docs.confluent.io/platform/current/app-development/kafkacat-usage.html)  
  [kcat GitHub](https://github.com/edenhill/kcat)   

## Optional but Recommended
For your group project you will be reading movies from the Kafka stream. Try finding the list of all topics and then read some movielog streams to get an idea of what the data looks like:  
`kcat -b localhost:9092 -L`

## Additional resources
- [Kafka Introduction Video 1](https://www.youtube.com/watch?v=PzPXRmVHMxI) <- Recommended video for a quick 5-min introduction to Kafka
- [Kafka Introduction Video 2](https://www.youtube.com/watch?v=JalUUBKdcA0)
- [Apache Kafka](https://kafka.apache.org/)
- [Kafka for Beginners](https://www.cloudkarafka.com/blog/2016-11-30-part1-kafka-for-beginners-what-is-apache-kafka.html)
- [What is Apache Kafka? - TIBCO](https://www.tibco.com/reference-center/what-is-apache-kafka)
- [Common bugs and solutions](./bug_list.md) - Troubleshooting guide for connection issues, code errors, and environment setup



