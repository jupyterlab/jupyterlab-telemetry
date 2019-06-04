# Implementation

This document supplements `design.md` and has sections for implementation of
the eventlogging design in various parts of the Jupyter ecosystem. These two
documents will co-evolve - as we think more about implementation, the design
will change, and vice versa.

## JupyterLab

A *lot* of user actions happen here, so a well thought out extensible mechanism
is extremely important.

Some parts of this might be:

1. The core event routing component to send events to the configured "sink".
2. An interface to expose to JupyterLab extension developers to be able to
   publish custom events
3. An interface to expose to operators/admins writing their own custom sink
   (as JupyterLab extensions themselves) and register themselves with the core
   routing components

## JupyterHub

## Notebook Server

## Classic Notebook?

## Kernels?