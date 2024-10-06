/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

export default function KeyContent() {
  const { toast } = useToast();
  const keys = JSON.parse(window.localStorage.getItem('keys') ?? 'null');

  const [slackBotToken, setSlackBotToken] = useState<string>(
    keys?.slackBotToken ?? ''
  );
  const [slackChannelToken, setSlackChannelToken] = useState<string>(
    keys?.slackChannelToken ?? ''
  );
  const [jiraEmail, setJiraEmail] = useState<string>(keys?.jiraEmail ?? '');
  const [jiraApiToken, setJiraApiToken] = useState<string>(
    keys?.jiraApiToken ?? ''
  );
  const [jiraProjectKey, setJiraProjectKey] = useState<string>(
    keys?.jiraProjectKey ?? ''
  );
  const [jiraDomain, setJiraDomain] = useState<string>(keys?.jiraDomain ?? '');

  const onSaveClick = () => {
    try {
      window.localStorage.setItem(
        'keys',
        JSON.stringify({
          slackBotToken: slackBotToken,
          slackChannelToken: slackChannelToken,
          jiraEmail: jiraEmail,
          jiraApiToken: jiraApiToken,
          jiraProjectKey: jiraProjectKey,
          jiraDomain: jiraDomain,
        })
      );
      toast({
        title: 'Success',
        description: 'Keys saved successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `${error.message}`,
      });
    }
  };

  const onCancelClick = () => {
    try {
      setSlackBotToken(keys.slackBotToken ?? '');
      setSlackChannelToken(keys.slackChannelToken ?? '');
      setJiraEmail(keys.jiraEmail ?? '');
      setJiraApiToken(keys.jiraApiToken ?? '');
      setJiraProjectKey(keys.jiraProjectKey ?? '');
      setJiraDomain(keys.jiraDomain ?? '');
      toast({
        title: 'Success',
        description: 'Keys reset successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `${error.message}`,
      });
    }
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Keys</h2>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Input keys here</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="slack_bot_token">Slack Bot Token</Label>
            <Input
              id="slack_bot_token"
              placeholder="Enter Slack Bot Token"
              value={slackBotToken}
              onChange={(e) => setSlackBotToken(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="slack_channel_token">Slack Channel Token</Label>
            <Input
              id="slack_channel_token"
              placeholder="Enter Slack Channel Token"
              value={slackChannelToken}
              onChange={(e) => setSlackChannelToken(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="jira_email">Jira Email</Label>
            <Input
              id="jira_email"
              placeholder="Enter Jira Email"
              value={jiraEmail}
              onChange={(e) => setJiraEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="jira_api_token">Jira API Token</Label>
            <Input
              id="jira_api_token"
              placeholder="Enter Jira API Token"
              value={jiraApiToken}
              onChange={(e) => setJiraApiToken(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="jira_project_key">Jira Project Key</Label>
            <Input
              id="jira_project_key"
              placeholder="Enter Jira Project Key"
              value={jiraProjectKey}
              onChange={(e) => setJiraProjectKey(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="jira_domain">Jira Domain</Label>
            <Input
              id="jira_domain"
              placeholder="Enter Jira Domain"
              value={jiraDomain}
              onChange={(e) => setJiraDomain(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="mt-4 space-x-2 flex flex-row">
          <Button onClick={onSaveClick}>Save</Button>
          <Button variant={'secondary'} onClick={onCancelClick}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
