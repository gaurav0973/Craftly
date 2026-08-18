import { Template, defaultBuildLogger } from 'e2b'
import { template as nextJSTemplate } from './template'

Template.build(nextJSTemplate , "c0-build" , {
    cpuCount: 4,
    memoryMB: 4096,
    onBuildLogs: defaultBuildLogger(),
    apiKey:process.env.E2B_API_KEY || "e2b_00cf449a8ebfe845fff655433076b61176d62125"
})
