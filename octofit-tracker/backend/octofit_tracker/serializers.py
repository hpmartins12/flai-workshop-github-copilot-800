from rest_framework import serializers
from bson import ObjectId
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'team_id', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if '_id' in representation and isinstance(representation['_id'], ObjectId):
            representation['_id'] = str(representation['_id'])
        if representation.get('id') and isinstance(representation['id'], ObjectId):
            representation['id'] = str(representation['id'])
        return representation


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if '_id' in representation and isinstance(representation['_id'], ObjectId):
            representation['_id'] = str(representation['_id'])
        if representation.get('id') and isinstance(representation['id'], ObjectId):
            representation['id'] = str(representation['id'])
        return representation


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'activity_type', 'duration', 'calories', 'distance', 'notes', 'created_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if '_id' in representation and isinstance(representation['_id'], ObjectId):
            representation['_id'] = str(representation['_id'])
        if representation.get('id') and isinstance(representation['id'], ObjectId):
            representation['id'] = str(representation['id'])
        return representation


class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaderboard
        fields = ['id', 'team_id', 'total_calories', 'total_activities', 'rank', 'updated_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if '_id' in representation and isinstance(representation['_id'], ObjectId):
            representation['_id'] = str(representation['_id'])
        if representation.get('id') and isinstance(representation['id'], ObjectId):
            representation['id'] = str(representation['id'])
        return representation


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'difficulty', 'duration', 'calories_estimate', 'category', 'created_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if '_id' in representation and isinstance(representation['_id'], ObjectId):
            representation['_id'] = str(representation['_id'])
        if representation.get('id') and isinstance(representation['id'], ObjectId):
            representation['id'] = str(representation['id'])
        return representation
