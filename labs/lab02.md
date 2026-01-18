# Lab 2: Kafka for Data Streaming

In this lab, you will gain hands-on experience with Apache Kafka, a distributed streaming platform that plays a key role in processing large-scale real-time data. You will establish a connection to a Kafka broker, produce and consume messages, and explore Kafka command-line tools. This lab will prepare you for your group project, where you'll work with Kafka streams. 

To receive credit for this lab, show your work to the TA during recitation.

## Deliverables
- [ ] Establish a secure SSH tunnel to the Kafka server. Explain to the TA the concepts of topic and offsets in Kafka and how this ensures message continuity if a consumer is disconnected.
- [ ] Modify starter code to implement producer and consumer modes for a Kafka topic. Explain the tradeoffs of the different *auto_offset_reset* values.
- [ ] Demonstrate using Kafka's CLI tool *kcat* (or alternatives) to manage and monitor Kafka topics and messages.


## Getting started
- Clone the starter code from this Git repository.
- Clone the starter code from this [Git repository](https://github.com/AshrithaG/mlip-lab-1/tree/main).
- The repository includes a python notebook for Kafka producer and consumer model.
- Set up a Python virtual environment (recommended):
  ```bash
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  ```

## Connecting to Kafka server
1. **Establish SSH tunnel** (find remote_server, user, and password on the Canvas entry for this lab):  
   ```bash
   ssh -L <local_port>:localhost:<remote_port> <user>@<remote_server> -NTf
   ```
   **Important**: Use the same `<local_port>` throughout the lab (e.g., 9092). This port will be your `bootstrap_servers` address.

2. **Verify the tunnel is active**:
   ```bash
   lsof -i :<local_port>  # Should show an ssh process
   ```

3. **Test the Kafka connection** (optional but recommended):
   ```bash
   kcat -b localhost:<local_port> -L  # Lists all available topics
   ```
   If this works, your connection is good!

4. **To kill the SSH tunnel** (when done):
   ```bash
   lsof -ti:<local_port> | xargs kill -9
   ```

## Implementing Producer-Consumer Mode
### 1. Producer Mode: Writes Data to Broker
Refer to the TODO sections in the notebook. You need to:
- Fill in your unique identifier (andrew_id) in the first cell
- Set the bootstrap_servers address (use the same port as your SSH tunnel, e.g., `['localhost:9092']`)
- Add a value_serializer to convert Python dicts to bytes (hint: JSON → UTF-8 bytes)
- Add 2-3 cities of your choice to the cities list
- Run the code to write messages to the Kafka stream

### 2. Consumer Mode: Reads Data from Broker
Modify the TODO section by filling appropriate parameters/arguments in the starter code. 
- Make sure the topic name matches what you used in the producer
- Use the same bootstrap_servers address
- Experiment with different `auto_offset_reset` values ('earliest', 'latest', 'none') to understand their behavior
- Verify `kafka_log.csv` is created and contains your messages  

Ref:  
[KafkaProducer Documentation](https://kafka-python.readthedocs.io/en/master/apidoc/KafkaProducer.html)  
[KafkaConsumer Documentation](https://kafka-python.readthedocs.io/en/master/apidoc/KafkaConsumer.html)

## Using Kafka's CLI tools
`kcat` is a CLI (Command Line Interface). Previously known as kafkacat.  
Install with your package installer such as:
- macOS: `brew install kcat`
- Ubuntu: `apt-get install kcat`
- Note for Windows Users: Setting up kcat on Windows is complex. Please work in pairs with someone with mac/Ubuntu during recitation for this deliverable. The purpose is to understand CLI which will be helpful in the group project for using Kafka on Virtual machines (Linux based).

**Important**: Make sure your SSH tunnel is active before running kcat commands!

Using the kcat documentation, write a command that connects to the local Kafka broker, specifies a topic, and consumes messages from the earliest offset.

Example structure:
```bash
kcat -b localhost:<local_port> -t <topic_name> -C -o earliest -c 5 -f "%o: %s\n"
```
Where:
- `-b`: broker address (use same port as SSH tunnel)
- `-t`: topic name (your topic from the notebook)
- `-C`: consumer mode
- `-o earliest`: start from earliest offset
- `-c 5`: consume 5 messages (optional, for testing)
- `-f "%o: %s\n"`: format flag to show offset and message (as requested in notebook) 

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
- [frequent bug list and solutions](./bug_list.md)



