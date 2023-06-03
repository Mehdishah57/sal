import { container } from "./main";
import Autowired from './Autowired';
import Controller from './Controller';
import Component from './Component';
import { Service } from './Service';
import Get from './Get';
import Post from './Post';
import Put from './Put';
import Patch from './Patch';
import Delete from './Delete';

const express = () => container.app;

export {
    container,
    express,
    Autowired,
    Controller,
    Component,
    Service,
    Get,
    Post,
    Put,
    Patch,
    Delete,
}