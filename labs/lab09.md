# Lab 9 : Data & Pipeline Versioning — DVC and Roar

In this lab you will run the same ML pipeline through two tools that take fundamentally different approaches to pipeline tracking and reproducibility:

- **DVC (Data Version Control)** — a *declarative* tool where you explicitly define your pipeline stages, dependencies, and outputs in a YAML file. You tell DVC what your pipeline looks like.
- **Roar (Run Observation & Artifact Registration)** — an *implicit* tool that observes file I/O as your code runs and automatically infers the dependency graph. You just run your code; Roar figures out the pipeline.

By using both on the same pipeline, you will understand not just how each tool works, but *why* these different design philosophies exist and when each is appropriate.


## Learning Objectives

1. Version datasets and models using DVC alongside Git
2. Run declarative, reproducible ML pipelines with `dvc.yaml`
3. Run and compare experiments with DVC's experiment tracking
4. Use Roar to implicitly track pipeline lineage without configuration files
5. Inspect and interpret auto-inferred lineage DAGs
6. Articulate when to use declarative (DVC) vs. observational (Roar) pipeline tracking

## The Dataset and Model

This lab uses the **Breast Cancer Wisconsin (Diagnostic)** dataset (569 samples, 30 numeric features computed from digitized images of breast tissue). The target variable is binary: **malignant (0)** or **benign (1)**. The pipeline trains a **Random Forest classifier** to predict the diagnosis from the features.

The dataset is small enough to version in Git for convenience, but in a real project this is exactly the kind of artifact you would manage with DVC.

## Deliverables

- **Deliverable 1 (Run DVC & Roar)**: Complete the step-by-step instructions in [INSTRUCTIONS.md](INSTRUCTIONS.md). Show the TA:
  - Your `dvc dag` output and `roar dag` output
  - The registered artifact lineage on [glaas.ai](https://glaas.ai/)

- **Deliverable 2 (Experimentation)**: Run 2–3 experiments with parameters you choose (different from the defaults in `params.yaml`) using **both** DVC and Roar. Show the TA how you compare results across runs in each tool and how you can trace back which data and parameters produced a given model.

- **Deliverable 3 (Reflection)**: Complete the [summary table](#summary-table) below and be prepared to discuss the [reflection questions](#reflection-questions) with the TA.

## How to Use This Repo

| File | What it contains |
|------|-----------------|
| **This README** | Overview, setup, reflection questions, and deliverables |
| [**INSTRUCTIONS.md**](INSTRUCTIONS.md) | Step-by-step commands for DVC (Part 1) and Roar (Part 2) |
| [**TROUBLESHOOTING.md**](TROUBLESHOOTING.md) | Common errors and how to fix them |

---

## Setup

### Prerequisites

- Git installed
- Python 3.10+ (installed via Homebrew, pyenv, or a standard installer — **not** the macOS system Python at `/usr/bin/python3`)
- A terminal environment (see platform notes below)

> **Platform notes**:
> - **macOS**: Both DVC and Roar work natively. Roar requires a non-Apple Python (Homebrew, pyenv, conda, or python.org installer). Run `which python3` — if it shows `/usr/bin/python3`, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md). If you run into any issues on macOS, we recommend that you work on your team's VM.
> - **Windows**: DVC works natively. Roar requires **WSL2** (Windows Subsystem for Linux). Install it with `wsl --install` in PowerShell if you don't have it, then do the entire lab inside WSL. If you run into any issues on Windows, we recommend that you work on your team's VM.
> - **Linux**: Everything works out of the box.

### Installation

1. Clone this repository:

```bash
git clone https://github.com/AshrithaG/mlip-lab-9.git
cd mlip-lab-9
```

2. Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Verify Roar installed correctly:

```bash
roar --version
```

### Repository Structure

```
mlip-lab-9/
├── data/raw/data.csv          # Breast Cancer Wisconsin dataset (569 samples, 30 features)
├── scripts/
│   ├── preprocess.py          # Train/test split
│   ├── train.py               # Random Forest training
│   ├── evaluate.py            # Model evaluation (accuracy, precision, recall, F1)
│   └── augment_data.py        # Adds synthetic rows to the dataset
├── params.yaml                # Hyperparameters for the pipeline
├── dvc.yaml                   # DVC pipeline definition (3 stages)
└── requirements.txt
```

### Verify the Pipeline

Before using any versioning tools, make sure the pipeline runs end-to-end:

```bash
python3 scripts/preprocess.py
python3 scripts/train.py
python3 scripts/evaluate.py
```

You should see output showing the data split, trained model parameters, and evaluation metrics. Fix any errors before proceeding.

---

**Next step**: Open [INSTRUCTIONS.md](INSTRUCTIONS.md) to begin Part 1 (DVC) and Part 2 (Roar). Once you have completed both parts, return here for Part 3.

---

## Part 3: Compare and Reflect

You have now used both tools on the same pipeline. Fill in the summary table and be ready to discuss the questions below with the TA. Refer to the official documentation as needed:

- [DVC Pipelines Guide](https://dvc.org/doc/user-guide/pipelines)
- [DVC Experiments Guide](https://dvc.org/doc/user-guide/experiment-management)
- [Roar on PyPI](https://pypi.org/project/roar-cli/)
- [GLaaS — Global Lineage as a Service](https://glaas.ai/)

### Reflection Questions

**Q1 — Setup and configuration**:
Compare the setup effort for DVC vs. Roar. What did you have to configure explicitly for DVC that Roar handled automatically? What did DVC give you that Roar did not?

**Q2 — The DAGs**:
Look at both DAG outputs side by side. Do they show the same pipeline structure? Are there any differences in what each tool captured? Which was easier to understand?

**Q3 — Handling changes**:
When you changed a hyperparameter (DVC) or augmented the dataset (Roar), how did each tool respond? With DVC, what determined which stages re-ran? With Roar, who decided what to re-run?

**Q4 — Experiment tracking and comparison**:
You ran multiple experiments with both DVC and Roar. How did you find and compare results across runs in each tool? How can you trace back which data version and which parameters produced a specific model? Which tool made this easier?

**Q5 — Team collaboration**:
Imagine a new teammate joins your project next month. With DVC, they can read `dvc.yaml` in the Git repo. With Roar, they can look up artifact lineage on GLaaS. Which gives a clearer picture of the pipeline? Could you use both tools together — and if so, how?

**Q6 — Your project**:
For your team's course project, which approach (or combination) would be more useful? Consider your data sources, pipeline complexity, and how your team collaborates.

### Summary Table

Fill in the following table based on your experience (replace the blanks):

| | DVC | Roar |
|---|---|---|
| **Philosophy** | ____________ | ____________ |
| **Config required** | ____________ | ____________ |
| **How is the DAG defined?** | ____________ | ____________ |
| **What happens on re-run?** | ____________ | ____________ |
| **How are artifacts versioned?** | ____________ | ____________ |
| **Reproducibility mechanism** | ____________ | ____________ |
| **Collaboration model** | ____________ | ____________ |
| **Platform support** | ____________ | ____________ |


## Resources

- [DVC Documentation](https://dvc.org/doc)
- [DVC Pipelines Guide](https://dvc.org/doc/user-guide/pipelines)
- [DVC Experiments Guide](https://dvc.org/doc/user-guide/experiment-management)
- [Roar on PyPI](https://pypi.org/project/roar-cli/)
- [GLaaS — Global Lineage as a Service](https://glaas.ai/)
