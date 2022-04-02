import React from 'react'
import { Channel, Server } from './services/models'

export const AllServersContext = React.createContext<Server[] | null>(null)
export const ServerContext = React.createContext<Server | null>(null)
export const ChannelsContext = React.createContext<Channel[] | null>(null)
