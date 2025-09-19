"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = void 0;
// src/utils/supabaseClient.js
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("../config/env");
const supabaseUrl = env_1.env.SUPABASE_URL;
const supabaseServiceKey = env_1.env.SUPABASE_SERVICE_ROLE_KEY;
exports.supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
