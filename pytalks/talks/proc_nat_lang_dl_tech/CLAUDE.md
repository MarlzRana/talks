I am presenting a presentation explaining how LLMs work under the hood. The approach I want to take is to explain the history of how we got to LLMs. I would like to highlight what space was like before LLMs, where RNNs were the primary language model, the limitations it had, how we got to attention RNN, and then eventually to the transformer architecture.

Here are the topics I would like to touch on in the set of presentations:
Presentation 1:
- NLP Task Formulations
- Stating the Neural Language Model Types:
	- FFN
    - RNN
    - Transformer Architecture
- Word2Vec FNN Architectures:
    - Bag of words approach
    - Skip gram approach
- RNN architecture:
    - Vanilla RNN
    - Exploding Gradient and Vanishing Gradient Problem
    - LSTM RNN
    - GRU RNN
    - Encoder Decoder RNNs
    - Attention RNN (this history nicely segways into why transformers are the way they are) architecture
Presentation 2:
- Transformer Architecture:
     - High-Level Overview
     - Embedding + Positional Encoding
     - Single-Head Attention Mechanism
     - Multi-Head Attention
     - FNN layers
     - Embeddings and Positional Embeddings
Presentation 3:
     - Encoder-only architecture (BERT)
        - Encoder Block
        - Encoder Pre-training
     - Decoder-only architecture (GPT)
	     - Decoder Block
	     - Masked Multi-Head attention
	     - Decoder Pre-training
    - Auto encoding vs Auto regressive meaning
     - Encoder-decoder architecture (T4)

**Important:** We are only creating presentation 1 here and you will create the presentation slide by slide in follow up prompts

## Development workflow

When working on a scene, comment out all other scenes in the `SLIDES` array so only the scene under development is active. This lets the user jump straight to the scene they're testing without navigating through earlier ones. The user will uncomment scenes themselves when they're ready.

## Guidance
- Use the AskUserQuestion tool until you are 95% confident
- **NEVER change quoted text**